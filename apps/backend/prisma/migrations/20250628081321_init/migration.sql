-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "studentID" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "categoryIDVoted" TEXT,
    "candidatesIDVoted" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "token" TEXT,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "adminUser" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "token" TEXT,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_studentID_key" ON "Student"("studentID");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_adminUser_key" ON "Admin"("adminUser");
