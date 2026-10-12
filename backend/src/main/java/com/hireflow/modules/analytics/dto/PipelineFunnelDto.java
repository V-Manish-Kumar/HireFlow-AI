package com.hireflow.modules.analytics.dto;

public class PipelineFunnelDto {
    private String stage;
    private long count;
    private double percentage;

    public PipelineFunnelDto() {}

    public PipelineFunnelDto(String stage, long count, double percentage) {
        this.stage = stage;
        this.count = count;
        this.percentage = percentage;
    }

    public String getStage() { return stage; }
    public void setStage(String stage) { this.stage = stage; }

    public long getCount() { return count; }
    public void setCount(long count) { this.count = count; }

    public double getPercentage() { return percentage; }
    public void setPercentage(double percentage) { this.percentage = percentage; }
}
