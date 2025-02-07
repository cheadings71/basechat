import assert from "assert";

import { and, eq } from "drizzle-orm";
import { NextRequest } from "next/server";

import db from "@/lib/server/db";
import * as schema from "@/lib/server/db/schema";
import { saveConnection } from "@/lib/server/service";
import * as settings from "@/lib/server/settings";
import { requireAdminContext } from "@/lib/server/utils";

export async function GET(request: NextRequest) {
  const { tenant, session } = await requireAdminContext();

  const connectionId = request.nextUrl.searchParams.get("connection_id");
  assert(connectionId, "expected connection_id");

  const rs = await db
    .select()
    .from(schema.tenants)
    .where(and(eq(schema.tenants.id, tenant.id), eq(schema.tenants.ownerId, session.user.id)));
  assert(rs.length === 1, "failed tenant lookup");
  await saveConnection(rs[0].id, connectionId, "syncing");

  return Response.redirect(new URL("data", settings.BASE_URL));
}
