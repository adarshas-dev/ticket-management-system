package com.example.ticketing.dto;

public class DashboardStatsResponse {
    private long totalTickets;
    private long openTickets;
    private long inProgressTickets;
    private long resolvedTickets;
    private long closedTickets;

    public DashboardStatsResponse(long totalTickets, long openTickets, long inProgressTickets, long resolvedTickets, long closedTickets) {
        this.totalTickets = totalTickets;
        this.openTickets = openTickets;
        this.inProgressTickets = inProgressTickets;
        this.resolvedTickets = resolvedTickets;
        this.closedTickets = closedTickets;
    }

    public long getTotalTickets() {
        return totalTickets;
    }

    public long getOpenTickets() {
        return openTickets;
    }

    public long getInProgressTickets() {
        return inProgressTickets;
    }

    public long getResolvedTickets() {
        return resolvedTickets;
    }

    public long getClosedTickets() {
        return closedTickets;
    }
}
