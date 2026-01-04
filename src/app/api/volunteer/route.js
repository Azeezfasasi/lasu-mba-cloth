import {
  createVolunteer,
  getAllVolunteers,
  getVolunteerStats,
} from "../../server/controllers/volunteerController";

export async function GET(req) {
  // Get all volunteers (admin only)
  return getAllVolunteers(req);
}

export async function POST(req) {
  // Create a new volunteer submission
  return createVolunteer(req);
}
