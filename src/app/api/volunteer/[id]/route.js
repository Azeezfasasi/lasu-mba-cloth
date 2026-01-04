import {
  getVolunteerById,
  updateVolunteerStatus,
  deleteVolunteer,
  addAdminNote,
  getVolunteerStats,
} from "../../../server/controllers/volunteerController";

export async function GET(req, { params }) {
  const { id } = await params;

  // Special route for stats
  if (id === "stats") {
    return getVolunteerStats(req);
  }

  // Get single volunteer
  return getVolunteerById(req, id);
}

export async function PUT(req, { params }) {
  const { id } = await params;
  const body = await req.json();

  // Check the action type
  if (body.action === "updateStatus") {
    return updateVolunteerStatus(id, body);
  } else if (body.action === "addNote") {
    return addAdminNote(id, body);
  }

  return new Response(JSON.stringify({ success: false, message: "Invalid action" }), {
    status: 400,
  });
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  return deleteVolunteer(req, id);
}
