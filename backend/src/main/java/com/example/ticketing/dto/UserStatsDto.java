package com.example.ticketing.dto;

public class UserStatsDto {

    private long open;
    private long inProgress;
    private long resolved;
    private long closed;

    public UserStatsDto(long open, long inProgress, long resolved, long closed) {
        this.open = open;
        this.inProgress = inProgress;
        this.resolved = resolved;
        this.closed = closed;
    }

    public long getOpen() { return open; }
    public long getInProgress() { return inProgress; }
    public long getResolved() { return resolved; }
    public long getClosed() { return closed; }
}