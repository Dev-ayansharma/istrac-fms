-- CreateEnum
CREATE TYPE "BaseRole" AS ENUM ('SUPER_ADMIN', 'DEPT_ADMIN', 'MEMBER', 'GUEST');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AccessLevel" AS ENUM ('READ_ONLY', 'READ_WRITE', 'READ_WRITE_DELETE');

-- CreateEnum
CREATE TYPE "NodeType" AS ENUM ('FOLDER', 'FILE');

-- CreateEnum
CREATE TYPE "FileStatus" AS ENUM ('ACTIVE', 'ORPHANED', 'DELETED', 'UNREGISTERED');

-- CreateEnum
CREATE TYPE "ReportCategory" AS ENUM ('SPECIAL_OPERATIONS', 'ANOMALY', 'STUDY', 'DAILY');

-- CreateEnum
CREATE TYPE "NotificationCategory" AS ENUM ('Files', 'Approvals', 'System');

-- CreateEnum
CREATE TYPE "OverrideEffect" AS ENUM ('GRANT', 'DENY');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "employeeId" TEXT,
    "passwordHash" TEXT,
    "role" "BaseRole" NOT NULL DEFAULT 'MEMBER',
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING',
    "tempPass" BOOLEAN NOT NULL DEFAULT true,
    "mfaSecret" TEXT,
    "mfaEnabled" BOOLEAN NOT NULL DEFAULT false,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hddPath" TEXT NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "allowUserFolderCreation" BOOLEAN NOT NULL DEFAULT false,
    "maxFolderDepth" INTEGER NOT NULL DEFAULT 5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDepartmentAccess" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "accessLevel" "AccessLevel" NOT NULL DEFAULT 'READ_ONLY',
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "UserDepartmentAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "parentId" TEXT,
    "nodeType" "NodeType" NOT NULL,
    "name" TEXT NOT NULL,
    "hddPath" TEXT NOT NULL,
    "sizeBytes" BIGINT,
    "mimeType" TEXT,
    "extension" TEXT,
    "sha256" TEXT,
    "status" "FileStatus" NOT NULL DEFAULT 'ACTIVE',
    "description" TEXT,
    "versionCount" INTEGER NOT NULL DEFAULT 1,
    "uploaderId" TEXT NOT NULL,
    "lastSynced" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "spacecraft" TEXT,
    "mission" TEXT,
    "reportCategory" "ReportCategory",
    "classificationLevel" TEXT,
    "reportVersionLabel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileVersion" (
    "id" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "versionNum" INTEGER NOT NULL,
    "hddPath" TEXT NOT NULL,
    "sizeBytes" BIGINT,
    "sha256" TEXT,
    "uploadedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FileVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FilePermission" (
    "id" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "access" "AccessLevel" NOT NULL,

    CONSTRAINT "FilePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileFavorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,

    CONSTRAINT "FileFavorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileShareLink" (
    "id" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "singleUse" BOOLEAN NOT NULL DEFAULT false,
    "usedAt" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FileShareLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileTag" (
    "fileId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "FileTag_pkey" PRIMARY KEY ("fileId","tagId")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" BIGSERIAL NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "resourceType" TEXT,
    "resourceId" TEXT,
    "oldValue" JSONB,
    "newValue" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CmsBlock" (
    "blockKey" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "CmsBlock_pkey" PRIMARY KEY ("blockKey")
);

-- CreateTable
CREATE TABLE "SystemConfig" (
    "configKey" TEXT NOT NULL,
    "configValue" TEXT NOT NULL,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SystemConfig_pkey" PRIMARY KEY ("configKey")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" BIGSERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "actorId" TEXT,
    "resourceType" TEXT,
    "resourceId" TEXT,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "category" "NotificationCategory" NOT NULL,
    "readAt" TIMESTAMP(3),
    "dismissedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomRole" (
    "id" TEXT NOT NULL,
    "departmentId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "permissions" JSONB NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCustomRole" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "assignedBy" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserCustomRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPermissionOverride" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "permission" TEXT NOT NULL,
    "effect" "OverrideEffect" NOT NULL,
    "grantedById" TEXT NOT NULL,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserPermissionOverride_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDashboardLayout" (
    "userId" TEXT NOT NULL,
    "layoutJson" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserDashboardLayout_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_employeeId_key" ON "User"("employeeId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_tokenHash_key" ON "RefreshToken"("tokenHash");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "PasswordHistory_userId_idx" ON "PasswordHistory"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_tokenHash_key" ON "PasswordResetToken"("tokenHash");

-- CreateIndex
CREATE INDEX "PasswordResetToken_userId_idx" ON "PasswordResetToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_key" ON "Department"("name");

-- CreateIndex
CREATE INDEX "Department_archived_idx" ON "Department"("archived");

-- CreateIndex
CREATE INDEX "UserDepartmentAccess_departmentId_idx" ON "UserDepartmentAccess"("departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "UserDepartmentAccess_userId_departmentId_key" ON "UserDepartmentAccess"("userId", "departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "File_hddPath_key" ON "File"("hddPath");

-- CreateIndex
CREATE INDEX "File_departmentId_status_idx" ON "File"("departmentId", "status");

-- CreateIndex
CREATE INDEX "File_parentId_idx" ON "File"("parentId");

-- CreateIndex
CREATE INDEX "File_spacecraft_idx" ON "File"("spacecraft");

-- CreateIndex
CREATE INDEX "FileVersion_fileId_idx" ON "FileVersion"("fileId");

-- CreateIndex
CREATE UNIQUE INDEX "FilePermission_fileId_userId_key" ON "FilePermission"("fileId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "FileFavorite_userId_fileId_key" ON "FileFavorite"("userId", "fileId");

-- CreateIndex
CREATE UNIQUE INDEX "FileShareLink_token_key" ON "FileShareLink"("token");

-- CreateIndex
CREATE INDEX "FileShareLink_fileId_idx" ON "FileShareLink"("fileId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE INDEX "AuditLog_userId_createdAt_idx" ON "AuditLog"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_action_createdAt_idx" ON "AuditLog"("action", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_userId_readAt_createdAt_idx" ON "Notification"("userId", "readAt", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_userId_type_createdAt_idx" ON "Notification"("userId", "type", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "CustomRole_departmentId_name_key" ON "CustomRole"("departmentId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "UserCustomRole_userId_roleId_departmentId_key" ON "UserCustomRole"("userId", "roleId", "departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPermissionOverride_userId_departmentId_permission_key" ON "UserPermissionOverride"("userId", "departmentId", "permission");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordHistory" ADD CONSTRAINT "PasswordHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDepartmentAccess" ADD CONSTRAINT "UserDepartmentAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDepartmentAccess" ADD CONSTRAINT "UserDepartmentAccess_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileVersion" ADD CONSTRAINT "FileVersion_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilePermission" ADD CONSTRAINT "FilePermission_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileFavorite" ADD CONSTRAINT "FileFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileFavorite" ADD CONSTRAINT "FileFavorite_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileShareLink" ADD CONSTRAINT "FileShareLink_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileTag" ADD CONSTRAINT "FileTag_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileTag" ADD CONSTRAINT "FileTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomRole" ADD CONSTRAINT "CustomRole_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCustomRole" ADD CONSTRAINT "UserCustomRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCustomRole" ADD CONSTRAINT "UserCustomRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "CustomRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPermissionOverride" ADD CONSTRAINT "UserPermissionOverride_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPermissionOverride" ADD CONSTRAINT "UserPermissionOverride_grantedById_fkey" FOREIGN KEY ("grantedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDashboardLayout" ADD CONSTRAINT "UserDashboardLayout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
