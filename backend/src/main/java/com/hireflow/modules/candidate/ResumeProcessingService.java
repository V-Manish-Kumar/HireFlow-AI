package com.hireflow.modules.candidate;

import com.hireflow.common.BadRequestException;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class ResumeProcessingService {

    private static final Logger log = LoggerFactory.getLogger(ResumeProcessingService.class);
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    private final Path uploadDir;

    public ResumeProcessingService(@Value("${app.storage.upload-dir:./uploads/resumes}") String uploadPath) {
        this.uploadDir = Paths.get(uploadPath).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.uploadDir);
        } catch (IOException e) {
            log.error("Could not initialize upload directory: {}", uploadPath, e);
        }
    }

    public static class ProcessedResume {
        private final String storedFilePath;
        private final String originalFilename;
        private final String extractedText;

        public ProcessedResume(String storedFilePath, String originalFilename, String extractedText) {
            this.storedFilePath = storedFilePath;
            this.originalFilename = originalFilename;
            this.extractedText = extractedText;
        }

        public String getStoredFilePath() { return storedFilePath; }
        public String getOriginalFilename() { return originalFilename; }
        public String getExtractedText() { return extractedText; }
    }

    public ProcessedResume processResumeFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Uploaded resume file is empty");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BadRequestException("File size exceeds 10MB limit");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !originalFilename.toLowerCase().endsWith(".pdf")) {
            throw new BadRequestException("Only PDF resume files are currently supported");
        }

        // Generate safe unique filename
        String safeFilename = UUID.randomUUID() + ".pdf";
        Path targetLocation = this.uploadDir.resolve(safeFilename);

        try {
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            log.error("Failed to store file: {}", safeFilename, e);
            throw new BadRequestException("Failed to store uploaded file: " + e.getMessage());
        }

        // Extract text using PDFBox 3.x
        String extractedText = extractTextFromPdf(targetLocation.toFile());

        return new ProcessedResume(targetLocation.toString(), originalFilename, extractedText);
    }

    public String extractTextFromPdf(File file) {
        try (PDDocument document = Loader.loadPDF(file)) {
            if (document.isEncrypted()) {
                log.warn("Uploaded PDF is password-protected: {}", file.getName());
                return "Note: PDF is encrypted/password protected. Automatic text extraction was bypassed.";
            }

            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setSortByPosition(true);
            String text = stripper.getText(document);

            if (text == null || text.trim().isEmpty()) {
                log.info("PDF contains no selectable text (scanned document): {}", file.getName());
                return "Note: No selectable text found. Scanned resume image detected.";
            }

            return text.trim();
        } catch (IOException e) {
            log.error("Failed to parse PDF file: {}", file.getName(), e);
            return "Note: Text extraction failed due to PDF format irregularity: " + e.getMessage();
        }
    }
}
