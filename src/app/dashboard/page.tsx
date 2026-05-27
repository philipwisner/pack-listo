import { redirect } from "next/navigation";
import { getCurrentUser } from "@/utils/auth/server";
import { getDashboardData } from "@/utils/data";
import { logoutAction } from "@/utils/auth/actions";
import { InternalLink } from "@/components/InternalLink/InternalLink";
import { css } from "@/styled-system/css";
import { flex, grid } from "@/styled-system/patterns";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { trips, stats, isFallback } = await getDashboardData(user.id);

  // Helper to get initials
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user.email[0].toUpperCase();

  return (
    <div
      className={flex({
        direction: "column",
        minHeight: "100vh",
        bg: { base: "slate.50", _dark: "zinc.950" },
        backgroundImage: {
          base: "radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.05) 0%, transparent 50%)",
          _dark: "radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.12) 0%, transparent 50%)",
        },
        fontFamily: "sans",
        color: { base: "slate.800", _dark: "zinc.200" },
      })}
    >
      {/* 1. HEADER SECTION */}
      <header
        className={css({
          borderBottom: "1px solid",
          borderColor: { base: "slate.200/60", _dark: "zinc.800/60" },
          bg: { base: "white/70", _dark: "zinc.900/40" },
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        })}
      >
        <div
          className={flex({
            justify: "space-between",
            align: "center",
            maxWidth: "6xl",
            mx: "auto",
            px: { base: "4", md: "8" },
            py: "4",
          })}
        >
          {/* Logo */}
          <div className={flex({ align: "center", gap: "2.5" })}>
            <div
              className={flex({
                width: "9",
                height: "9",
                align: "center",
                justify: "center",
                borderRadius: "lg",
                bg: "indigo.500",
                color: "white",
                shadow: "0 0 10px rgba(99, 102, 241, 0.3)",
              })}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
            </div>
            <span
              className={css({
                fontSize: "lg",
                fontWeight: "bold",
                color: { base: "slate.900", _dark: "white" },
                letterSpacing: "tight",
              })}
            >
              PackListo
            </span>
          </div>

          {/* User profile & logout */}
          <div className={flex({ align: "center", gap: "4" })}>
            <div className={flex({ align: "center", gap: "3" })}>
              <div
                className={flex({
                  width: "9",
                  height: "9",
                  borderRadius: "full",
                  bg: "indigo.100",
                  color: "indigo.600",
                  _dark: { bg: "indigo.950", color: "indigo.400" },
                  align: "center",
                  justify: "center",
                  fontSize: "sm",
                  fontWeight: "bold",
                  border: "2px solid",
                  borderColor: "indigo.200",
                })}
              >
                {initials}
              </div>
              <span
                className={css({
                  fontSize: "sm",
                  fontWeight: "medium",
                  color: { base: "slate.700", _dark: "zinc.300" },
                  display: { base: "none", sm: "inline" },
                })}
              >
                {user.name || user.email}
              </span>
            </div>

            {user.isAdmin && (
              <InternalLink text="Admin" url="/admin" />
            )}

            <form action={logoutAction}>
              <button
                type="submit"
                className={css({
                  px: "3.5",
                  py: "2",
                  borderRadius: "xl",
                  border: "1px solid",
                  borderColor: { base: "slate-200", _dark: "zinc-800" },
                  color: { base: "slate.600", _dark: "zinc.400" },
                  fontSize: "xs",
                  fontWeight: "semibold",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  _hover: {
                    bg: { base: "slate.100", _dark: "zinc-800/50" },
                    color: { base: "slate.900", _dark: "white" },
                  },
                })}
              >
                Log Out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* 2. MAIN BODY */}
      <main
        className={flex({
          direction: "column",
          flex: 1,
          maxWidth: "6xl",
          width: "full",
          mx: "auto",
          px: { base: "4", md: "8" },
          py: "8",
          gap: "8",
        })}
      >
        {/* Offline Banner alert if database fallback is active */}
        {isFallback && (
          <div
            className={flex({
              align: "center",
              justify: "space-between",
              gap: "3",
              bg: { base: "amber.50/80", _dark: "amber.950/20" },
              backdropFilter: "blur(8px)",
              border: "1px dashed",
              borderColor: "amber.500/40",
              color: { base: "amber.800", _dark: "amber.400" },
              px: "4",
              py: "3.5",
              borderRadius: "xl",
              fontSize: "xs",
            })}
          >
            <div className={flex({ align: "center", gap: "2.5" })}>
              <span className={css({ fontSize: "base" })}>⚡</span>
              <div>
                <strong className={css({ fontWeight: "semibold" })}>
                  Local Offline Mock Mode Active:
                </strong>{" "}
                Running database-free using cookies & preloaded mock lists. Perfect for rapid prototyping!
              </div>
            </div>
            <div
              className={css({
                bg: "amber.500/20",
                px: "2.5",
                py: "0.5",
                borderRadius: "full",
                fontWeight: "bold",
                textTransform: "uppercase",
                fontSize: "[10px]",
              })}
            >
              Mocked
            </div>
          </div>
        )}

        {/* Dashboard Title */}
        <div className={flex({ direction: "column", gap: "1" })}>
          <h2
            className={css({
              fontSize: "2xl",
              fontWeight: "extrabold",
              color: { base: "slate.900", _dark: "white" },
              letterSpacing: "tight",
            })}
          >
            Your Packing Dashboard
          </h2>
          <p
            className={css({
              fontSize: "sm",
              color: { base: "slate.500", _dark: "zinc.400" },
            })}
          >
            Track your trips and pack seamlessly.
          </p>
        </div>

        {/* 3. METRIC STATS */}
        <section
          className={grid({
            columns: { base: 1, sm: 2, md: 4 },
            gap: "5",
          })}
        >
          {/* Card 1 */}
          <div
            className={css({
              bg: { base: "white", _dark: "zinc.900/40" },
              border: "1px solid",
              borderColor: { base: "slate-100", _dark: "zinc-800/60" },
              borderRadius: "2xl",
              p: "5",
              shadow: "sm",
              transition: "transform 0.2s ease, shadow 0.2s ease",
              _hover: { transform: "translateY(-2px)", shadow: "md" },
            })}
          >
            <div className={flex({ align: "center", justify: "space-between" })}>
              <span
                className={css({
                  fontSize: "xs",
                  fontWeight: "bold",
                  color: "slate.400",
                  textTransform: "uppercase",
                  letterSpacing: "wider",
                })}
              >
                Total Trips
              </span>
              <div
                className={flex({
                  width: "8",
                  height: "8",
                  borderRadius: "lg",
                  bg: "blue.500/10",
                  color: "blue.500",
                  align: "center",
                  justify: "center",
                })}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
              </div>
            </div>
            <div className={css({ mt: "4" })}>
              <span
                className={css({
                  fontSize: "3xl",
                  fontWeight: "bold",
                  color: { base: "slate.900", _dark: "white" },
                })}
              >
                {stats.totalTrips}
              </span>
            </div>
          </div>

          {/* Card 2 */}
          <div
            className={css({
              bg: { base: "white", _dark: "zinc.900/40" },
              border: "1px solid",
              borderColor: { base: "slate-100", _dark: "zinc-800/60" },
              borderRadius: "2xl",
              p: "5",
              shadow: "sm",
              transition: "transform 0.2s ease, shadow 0.2s ease",
              _hover: { transform: "translateY(-2px)", shadow: "md" },
            })}
          >
            <div className={flex({ align: "center", justify: "space-between" })}>
              <span
                className={css({
                  fontSize: "xs",
                  fontWeight: "bold",
                  color: "slate.400",
                  textTransform: "uppercase",
                  letterSpacing: "wider",
                })}
              >
                Fully Packed
              </span>
              <div
                className={flex({
                  width: "8",
                  height: "8",
                  borderRadius: "lg",
                  bg: "green.500/10",
                  color: "green.500",
                  align: "center",
                  justify: "center",
                })}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
            <div className={css({ mt: "4" })}>
              <span
                className={css({
                  fontSize: "3xl",
                  fontWeight: "bold",
                  color: { base: "slate.900", _dark: "white" },
                })}
              >
                {stats.packedTrips}
              </span>
            </div>
          </div>

          {/* Card 3 */}
          <div
            className={css({
              bg: { base: "white", _dark: "zinc.900/40" },
              border: "1px solid",
              borderColor: { base: "slate-100", _dark: "zinc-800/60" },
              borderRadius: "2xl",
              p: "5",
              shadow: "sm",
              transition: "transform 0.2s ease, shadow 0.2s ease",
              _hover: { transform: "translateY(-2px)", shadow: "md" },
            })}
          >
            <div className={flex({ align: "center", justify: "space-between" })}>
              <span
                className={css({
                  fontSize: "xs",
                  fontWeight: "bold",
                  color: "slate.400",
                  textTransform: "uppercase",
                  letterSpacing: "wider",
                })}
              >
                Items Packed
              </span>
              <div
                className={flex({
                  width: "8",
                  height: "8",
                  borderRadius: "lg",
                  bg: "purple.500/10",
                  color: "purple.500",
                  align: "center",
                  justify: "center",
                })}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M12.89 2.24a2 2 0 0 0-1.78 0L3.5 6.24A2 2 0 0 0 2.5 8v8a2 2 0 0 0 1 1.73l7.61 4.39a2 2 0 0 0 1.78 0l7.61-4.39a2 2 0 0 0 1-1.73V8a2 2 0 0 0-1-1.73z" />
                </svg>
              </div>
            </div>
            <div className={css({ mt: "4" })}>
              <span
                className={css({
                  fontSize: "3xl",
                  fontWeight: "bold",
                  color: { base: "slate.900", _dark: "white" },
                })}
              >
                {stats.totalItemsPacked}
              </span>
            </div>
          </div>

          {/* Card 4 */}
          <div
            className={css({
              bg: { base: "white", _dark: "zinc.900/40" },
              border: "1px solid",
              borderColor: { base: "slate-100", _dark: "zinc-800/60" },
              borderRadius: "2xl",
              p: "5",
              shadow: "sm",
              transition: "transform 0.2s ease, shadow 0.2s ease",
              _hover: { transform: "translateY(-2px)", shadow: "md" },
            })}
          >
            <div className={flex({ align: "center", justify: "space-between" })}>
              <span
                className={css({
                  fontSize: "xs",
                  fontWeight: "bold",
                  color: "slate.400",
                  textTransform: "uppercase",
                  letterSpacing: "wider",
                })}
              >
                Overall Progress
              </span>
              <div
                className={flex({
                  width: "8",
                  height: "8",
                  borderRadius: "lg",
                  bg: "indigo.500/10",
                  color: "indigo.500",
                  align: "center",
                  justify: "center",
                })}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
            </div>
            <div className={css({ mt: "4" })}>
              <span
                className={css({
                  fontSize: "3xl",
                  fontWeight: "bold",
                  color: { base: "slate.900", _dark: "white" },
                })}
              >
                {stats.overallProgress}%
              </span>
            </div>
          </div>
        </section>

        {/* 4. ACTIVE PACKING LISTS */}
        <section className={flex({ direction: "column", gap: "5" })}>
          <div className={flex({ justify: "space-between", align: "center" })}>
            <h3
              className={css({
                fontSize: "lg",
                fontWeight: "bold",
                color: { base: "slate.900", _dark: "white" },
              })}
            >
              Active Trips & Packing Lists
            </h3>
            <button
              type="button"
              className={css({
                px: "4",
                py: "2",
                borderRadius: "xl",
                bg: "indigo.500",
                color: "white",
                fontSize: "xs",
                fontWeight: "semibold",
                cursor: "pointer",
                transition: "all 0.2s ease",
                shadow: "0 4px 10px rgba(99, 102, 241, 0.2)",
                _hover: {
                  bg: "indigo.600",
                  transform: "translateY(-1px)",
                },
                _active: { transform: "translateY(0)" },
              })}
            >
              + Create New List
            </button>
          </div>

          <div
            className={grid({
              columns: { base: 1, md: 2, lg: 3 },
              gap: "6",
            })}
          >
            {trips.map((trip) => {
              // Color matching for bags
              let bagColorClass = css({
                bg: "blue.50",
                color: "blue.600",
                _dark: { bg: "blue.950/40", color: "blue.400" },
              });
              if (trip.bagType.includes("Suitcase") || trip.bagType.includes("Checked")) {
                bagColorClass = css({
                  bg: "orange.50",
                  color: "orange.600",
                  _dark: { bg: "orange.950/40", color: "orange.400" },
                });
              } else if (trip.bagType.includes("Personal")) {
                bagColorClass = css({
                  bg: "pink.50",
                  color: "pink.600",
                  _dark: { bg: "pink.950/40", color: "pink.400" },
                });
              }

              // Color matching for status
              const statusColorClass =
                trip.status === "READY"
                  ? css({
                      bg: "green.50",
                      color: "green.600",
                      _dark: { bg: "green.950/40", color: "green.400" },
                    })
                  : css({
                      bg: "amber.50",
                      color: "amber.600",
                      _dark: { bg: "amber.950/40", color: "amber.400" },
                    });

              return (
                <div
                  key={trip.id}
                  className={flex({
                    direction: "column",
                    bg: { base: "white", _dark: "zinc.900/40" },
                    border: "1px solid",
                    borderColor: { base: "slate-100", _dark: "zinc-800/60" },
                    borderRadius: "2xl",
                    p: "6",
                    shadow: "sm",
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden",
                    _hover: {
                      transform: "translateY(-4px)",
                      shadow: "xl",
                      borderColor: "indigo.500/20",
                    },
                  })}
                >
                  {/* Decorative edge line reflecting status */}
                  <div
                    className={css({
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: "1.5",
                      bg: trip.status === "READY" ? "green.500" : "indigo.400",
                    })}
                  />

                  {/* Trip Header */}
                  <div className={flex({ justify: "space-between", align: "flex-start", mb: "3" })}>
                    <div className={flex({ direction: "column", gap: "1" })}>
                      <h4
                        className={css({
                          fontSize: "md",
                          fontWeight: "bold",
                          color: { base: "slate.900", _dark: "white" },
                        })}
                      >
                        {trip.name}
                      </h4>
                      <span
                        className={css({
                          fontSize: "xs",
                          color: { base: "slate.400", _dark: "zinc.500" },
                          fontWeight: "medium",
                        })}
                      >
                        📍 {trip.destination || "Anywhere"}
                      </span>
                    </div>

                    <span
                      className={[
                        css({
                          px: "2.5",
                          py: "0.5",
                          borderRadius: "full",
                          fontSize: "[10px]",
                          fontWeight: "extrabold",
                          textTransform: "uppercase",
                          letterSpacing: "wider",
                        }),
                        statusColorClass,
                      ].join(" ")}
                    >
                      {trip.status}
                    </span>
                  </div>

                  {/* Date and Length */}
                  <div
                    className={flex({
                      align: "center",
                      gap: "3",
                      fontSize: "xs",
                      color: { base: "slate.500", _dark: "zinc.400" },
                      mb: "4",
                    })}
                  >
                    <span>
                      📅{" "}
                      {trip.tripDate
                        ? new Date(trip.tripDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "No departure date"}
                    </span>
                    <span>•</span>
                    <span>⏱️ {trip.lengthOfStay || 0} days</span>
                  </div>

                  {/* Bag Tag */}
                  <div className={flex({ mb: "6" })}>
                    <span
                      className={[
                        css({
                          px: "2.5",
                          py: "1",
                          borderRadius: "lg",
                          fontSize: "xs",
                          fontWeight: "semibold",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "1.5",
                        }),
                        bagColorClass,
                      ].join(" ")}
                    >
                      🧳 {trip.bagType}
                    </span>
                  </div>

                  {/* Packing Progress */}
                  <div className={flex({ direction: "column", gap: "2.5", mt: "auto" })}>
                    <div className={flex({ justify: "space-between", align: "center", fontSize: "xs" })}>
                      <span className={css({ color: { base: "slate.500", _dark: "zinc.400" }, fontWeight: "medium" })}>
                        Packing Progress
                      </span>
                      <strong className={css({ color: { base: "slate.900", _dark: "white" } })}>
                        {trip.packedItems} / {trip.totalItems} ({trip.packedPercentage}%)
                      </strong>
                    </div>

                    {/* Progress Bar Container */}
                    <div
                      className={css({
                        width: "full",
                        height: "2",
                        bg: { base: "slate.100", _dark: "zinc-800" },
                        borderRadius: "full",
                        overflow: "hidden",
                      })}
                    >
                      <div
                        className={css({
                          height: "full",
                          bgGradient: "to-r",
                          gradientFrom: trip.status === "READY" ? "green.400" : "indigo.400",
                          gradientTo: trip.status === "READY" ? "emerald.500" : "violet.500",
                          borderRadius: "full",
                          transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        })}
                        style={{ width: `${trip.packedPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
