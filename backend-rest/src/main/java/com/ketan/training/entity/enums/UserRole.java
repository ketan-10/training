package com.ketan.training.entity.enums;

public enum UserRole {
    ADMIN, REQUESTER;

    // For ease of use in @PreAuthorize annotation
    public static class Authority {
        public static final String REQUESTER = "hasAuthority('REQUESTER')";
        public static final String ADMIN = "hasAuthority('ADMIN')";
    }
}
