package com.hireflow.modules.notification;

import com.hireflow.common.PagedResponse;
import com.hireflow.common.ResourceNotFoundException;
import com.hireflow.common.UnauthorizedException;
import com.hireflow.modules.notification.dto.NotificationDto;
import com.hireflow.modules.user.User;
import com.hireflow.modules.user.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserService userService;

    public NotificationService(NotificationRepository notificationRepository, UserService userService) {
        this.notificationRepository = notificationRepository;
        this.userService = userService;
    }

    public void createNotification(User user, String title, String message, NotificationType type, String linkUrl) {
        if (user == null) return;
        Notification notification = new Notification(user, title, message, type, linkUrl);
        notificationRepository.save(notification);
    }

    public PagedResponse<NotificationDto> getNotifications(int page, int size) {
        User currentUser = userService.getCurrentUser();
        Pageable pageable = PageRequest.of(page, size);
        Page<Notification> notificationPage = notificationRepository.findByUserOrderByCreatedAtDesc(currentUser, pageable);

        List<NotificationDto> dtoList = notificationPage.getContent().stream()
                .map(NotificationDto::new)
                .toList();

        return new PagedResponse<>(
                dtoList,
                notificationPage.getNumber(),
                notificationPage.getSize(),
                notificationPage.getTotalElements(),
                notificationPage.getTotalPages(),
                notificationPage.isLast()
        );
    }

    public long getUnreadCount() {
        User currentUser = userService.getCurrentUser();
        return notificationRepository.countByUserAndIsReadFalse(currentUser);
    }

    @Transactional
    public void markAsRead(Long id) {
        User currentUser = userService.getCurrentUser();
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", id));

        if (!notification.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("Unauthorized access to notification");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead() {
        User currentUser = userService.getCurrentUser();
        List<Notification> list = notificationRepository.findTop10ByUserOrderByCreatedAtDesc(currentUser);
        for (Notification n : list) {
            n.setRead(true);
        }
        notificationRepository.saveAll(list);
    }
}
