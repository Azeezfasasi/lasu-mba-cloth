# LASUMBA Games Volunteer Management System

Complete volunteer management system for LASUMBA Games 2026 with backend API, public form, and admin dashboard.

## 📁 Files Created

### Backend

1. **[src/app/server/models/Volunteer.js](src/app/server/models/Volunteer.js)**

   - MongoDB Volunteer schema
   - Fields: personal info, student details, activities, availability, status, admin notes
   - Indexes for optimized queries

2. **[src/app/server/controllers/volunteerController.js](src/app/server/controllers/volunteerController.js)**
   - `createVolunteer()` - Submit new volunteer application
   - `getAllVolunteers()` - List all volunteers (with filtering)
   - `getVolunteerById()` - Get volunteer details
   - `updateVolunteerStatus()` - Change approval status
   - `addAdminNote()` - Add admin replies/notes
   - `deleteVolunteer()` - Remove volunteer
   - `getVolunteerStats()` - Get statistics

### API Routes

3. **[src/app/api/volunteer/route.js](src/app/api/volunteer/route.js)**

   - `GET` - List all volunteers
   - `POST` - Create new volunteer submission

4. **[src/app/api/volunteer/[id]/route.js](src/app/api/volunteer/[id]/route.js)**
   - `GET` - Get volunteer by ID / Get stats
   - `PUT` - Update status or add notes (action-based)
   - `DELETE` - Delete volunteer

### Frontend Components

5. **[src/components/VolunteerForm.jsx](src/components/VolunteerForm.jsx)**

   - Public volunteer registration form
   - Client-side component with form validation
   - Success/error notifications
   - Sections:
     - Personal Information
     - Student Information
     - Activities selection (checkboxes)
     - Availability (radio buttons)
     - Experience level
     - Additional information

6. **[src/components/VolunteersDashboard.jsx](src/components/VolunteersDashboard.jsx)**
   - Admin volunteer management dashboard
   - Features:
     - Statistics cards (Total, Pending, Approved, Rejected)
     - Search by name, email, student ID
     - Filter by status
     - View volunteer details modal
     - Change volunteer status (approve/reject)
     - Add admin notes/replies
     - Delete volunteers

### Updated Pages

7. **[src/app/volunteer/page.js](src/app/volunteer/page.js)**

   - Public volunteer page with event info and registration form

8. **[src/app/dashboard/lasumba-vulunteers/page.js](src/app/dashboard/lasumba-volunteers/page.js)**
   - Admin dashboard for volunteer management

## 🔧 API Endpoints

### Create Volunteer (Public)

```
POST /api/volunteer
Body: {
  firstName, lastName, email, phone, studentId, program,
  department, interestedActivities, availability,
  experience, additionalInfo
}
Response: { success: true, volunteer: {...} }
```

### Get All Volunteers (Admin)

```
GET /api/volunteer
Query: ?status=pending|approved|rejected|all
Response: { success: true, volunteers: [...] }
```

### Get Volunteer Stats

```
GET /api/volunteer/stats/stats
Response: {
  success: true,
  stats: { total, approved, pending, rejected }
}
```

### Get Single Volunteer

```
GET /api/volunteer/{id}
Response: { success: true, volunteer: {...} }
```

### Update Status

```
PUT /api/volunteer/{id}
Body: { action: "updateStatus", status: "approved|rejected|pending" }
Response: { success: true, volunteer: {...} }
```

### Add Admin Note

```
PUT /api/volunteer/{id}
Body: { action: "addNote", message: "...", adminId: "..." }
Response: { success: true, volunteer: {...} }
```

### Delete Volunteer

```
DELETE /api/volunteer/{id}
Response: { success: true, message: "Volunteer deleted successfully" }
```

## 🎯 Features

### Public Features

- ✅ Complete volunteer registration form
- ✅ Multi-step form with validation
- ✅ Success/error notifications
- ✅ Prevent duplicate submissions (by studentId)
- ✅ Responsive design

### Admin Features

- ✅ View all volunteers in table format
- ✅ Search functionality
- ✅ Filter by status
- ✅ Statistics dashboard
- ✅ View detailed volunteer information
- ✅ Change volunteer status (approve/reject)
- ✅ Add notes/replies to volunteers
- ✅ Delete volunteers
- ✅ Modals for details and notes

## 📊 Volunteer Status

- **pending** - Initial submission status
- **approved** - Volunteer accepted
- **rejected** - Volunteer not accepted

## 🚀 Usage

### For Students (Public)

1. Navigate to `/volunteer`
2. Fill out the registration form
3. Select activities and availability
4. Submit application

### For Admins

1. Navigate to `/dashboard/lasumba-vulunteers`
2. View all volunteers with statistics
3. Search or filter volunteers
4. Click to view full details
5. Change status or add notes as needed
6. Delete if necessary

## 🔐 Security Notes

- Admin note creation requires `adminId` - ensure proper authentication
- Consider adding role-based access control for admin dashboard
- Add input validation and sanitization for all forms
- Implement email notifications for status changes

## ⚠️ Todo/Notes

- [ ] Add email notifications when volunteer status changes
- [ ] Implement proper authentication/authorization for admin routes
- [ ] Add export to CSV functionality
- [ ] Add bulk status update feature
- [ ] Implement email confirmation for new submissions
- [ ] Add volunteer attendance tracking
- [ ] Create volunteer email templates

## 📱 Activity Options

- Football Competition
- Track & Field Events
- Chess & Draught Games
- Table Tennis
- Table Soccer
- Lawn Tennis
- Organizing/Setup
- Registration
- Medical Support
- Photography

## 📋 Form Fields Captured

**Personal:**

- First Name, Last Name, Email, Phone

**Student:**

- Student ID, Program (MBA 1/2), Department

**Volunteer:**

- Interested Activities (multiple select)
- Availability (Full Day/Morning/Afternoon/Evening)
- Experience Level (None/Some/Extensive)
- Additional Information (optional)

**Admin:**

- Status (pending/approved/rejected)
- Notes/Replies from admin
- Submission timestamp
- Last updated timestamp
