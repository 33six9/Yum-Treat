"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { EmptyState } from "@/components/UI";

export default function AdminGuard({ children }) {
  const { ready, isAuthenticated, isAdmin } = useAuth() || {};

  if (!ready) return null;

  if (!isAuthenticated || !isAdmin) {
    return (
      <section className="section-pad">
        <div className="container-x">
          <EmptyState
            title="Admin access only"
            subtitle="Sign in with an admin account to manage foods and orders."
            action={
              <Link href="/signin" className="btn-primary mt-2">
                Sign in
              </Link>
            }
          />
        </div>
      </section>
    );
  }

  return children;
}
