package com.hireflow.modules.analytics.dto;

public class ApplicationTrendDto {
    private String period; // e.g., "Jan", "Feb", "2026-10"
    private long total;
    private long hired;

    public ApplicationTrendDto() {}

    public ApplicationTrendDto(String period, long total, long hired) {
        this.period = period;
        this.total = total;
        this.hired = hired;
    }

    public String getPeriod() { return period; }
    public void setPeriod(String period) { this.period = period; }

    public long getTotal() { return total; }
    public void setTotal(long total) { this.total = total; }

    public long getHired() { return hired; }
    public void setHired(long hired) { this.hired = hired; }
}
