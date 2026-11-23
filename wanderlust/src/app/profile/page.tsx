import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DollarSign, Globe, Plane, TrendingUp } from "lucide-react";
import { auth } from "@/lib/auth";
import EditProfile from "@/components/EditProfile";

interface BookingItem {
  _id: string;
  country?: string;
  price?: string | number;
  departureDate?: string;
}

const ProfilePage = async () => {
  const reqHeaders = await headers();

  const session = await auth.api.getSession({
    headers: reqHeaders,
  });
  const user = session?.user;

  if (!user) {
    redirect("/login");
  }

  const jwtToken = await auth.api.getToken({
    headers: reqHeaders,
  });
  const token = jwtToken?.token;

  let bookings: BookingItem[] = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/my-bookings/${user.email}`, {
      cache: "no-store",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (res.ok && Array.isArray(data)) {
      bookings = data;
    }
  } catch (error) {
    console.error("Failed to fetch bookings for profile:", error);
  }

  const totalBookings = bookings.length;

  const countriesVisited = new Set(
    bookings.map((b) => b.country).filter(Boolean)
  ).size;

  const today = new Date();
  const upcomingTrips = bookings.filter(
    (b) => b.departureDate && new Date(b.departureDate) >= today
  ).length;

  const totalSpent = bookings.reduce(
    (sum, b) => sum + (Number(b.price) || 0),
    0
  );

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "N/A";

  const stats = [
    {
      label: "Total Bookings",
      value: totalBookings,
      icon: Plane,
      bgColor: "bg-cyan-50",
      iconColor: "text-[#13A5BF]",
    },
    {
      label: "Countries Visited",
      value: countriesVisited,
      icon: Globe,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      label: "Upcoming Trips",
      value: upcomingTrips,
      icon: TrendingUp,
      bgColor: "bg-orange-50",
      iconColor: "text-orange-500",
    },
    {
      label: "Total Spent",
      value: `$${totalSpent.toLocaleString("en-US")}`,
      icon: DollarSign,
      bgColor: "bg-fuchsia-50",
      iconColor: "text-fuchsia-500",
    },
  ];

  return (
    <main className="min-h-[75vh] flex-1 bg-white px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-4xl font-light tracking-tight text-neutral-950">
            My Profile
          </h1>
          <p className="mt-1.5 text-sm text-neutral-500">
            Manage your account settings and travel preferences
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[290px_1fr]">
          <EditProfile
            user={{
              name: user.name || "",
              email: user.email || "",
              image: user.image || "",
            }}
            memberSince={memberSince}
          />

          <section>
            <h2 className="mb-4 font-serif text-lg font-medium text-neutral-950">
              Travel Statistics
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {stats.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center justify-between border border-neutral-100 bg-white px-5 py-6 shadow-[0_1px_6px_rgba(0,0,0,0.04)]"
                  >
                    <div>
                      <p className="text-xs text-neutral-500">{item.label}</p>
                      <p className="mt-2 text-2xl font-semibold text-neutral-950">
                        {item.value}
                      </p>
                    </div>

                    <div
                      className={`flex size-11 items-center justify-center rounded-full ${item.bgColor}`}
                    >
                      <Icon
                        className={`size-5 ${item.iconColor}`}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;