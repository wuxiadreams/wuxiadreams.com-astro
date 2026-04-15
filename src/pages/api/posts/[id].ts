import { env } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { post } from "@/db/schema";

export async function PUT({
  locals,
  request,
  params,
}: {
  locals: any;
  request: Request;
  params: { id: string };
}) {
  const email = locals?.user?.email;
  const adminEmails = (env.ADMIN_EMAILS ?? "").split(",");

  if (!email || !adminEmails.includes(email || "")) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const postId = params.id;
    if (!postId) {
      return new Response(JSON.stringify({ error: "文章ID不能为空" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = (await request.json()) as Record<string, any>;

    // Support partial updates
    const updatedPost = await db
      .update(post)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(post.id, postId))
      .returning();

    if (updatedPost.length === 0) {
      return new Response(JSON.stringify({ error: "文章未找到或更新失败" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(updatedPost[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "更新文章失败" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE({
  locals,
  params,
}: {
  locals: any;
  params: { id: string };
}) {
  const email = locals?.user?.email;
  const adminEmails = (env.ADMIN_EMAILS ?? "").split(",");

  if (!email || !adminEmails.includes(email || "")) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const postId = params.id;
    if (!postId) {
      return new Response(JSON.stringify({ error: "文章ID不能为空" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const deletedPost = await db
      .delete(post)
      .where(eq(post.id, postId))
      .returning();

    if (deletedPost.length === 0) {
      return new Response(JSON.stringify({ error: "文章未找到" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ message: "文章删除成功" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "删除文章失败" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
