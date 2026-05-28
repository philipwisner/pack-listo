import { getCurrentUser } from "@/lib/auth";
import { getDashboardData } from "@/services/dashboard.service";
import { css } from "@/styled-system/css";
import { flex, grid } from "@/styled-system/patterns";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  // Safely redirect or error out if there's no user session found
  if (!user) {
    return <div>Please log in to view your dashboard.</div>;
  }

  const { trips, stats, error } = await getDashboardData(user.id);

  if (error) {
    console.error("Dashboard page error:", error);
  }

  return (
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
        {/* Card 1: Total Trips */}
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

        {/* Card 2: Fully Packed */}
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

        {/* Card 3: Items Packed */}
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

        {/* Card 4: Overall Progress */}
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

        {trips.length === 0 ? (
          <div
            className={css({
              textAlign: "center",
              py: "12",
              border: "2px dashed",
              borderColor: { base: "slate.200", _dark: "zinc.800" },
              borderRadius: "2xl",
              color: "slate.400",
            })}
          >
            No trips found. Click above to create your first packing list!
          </div>
        ) : (
          <div
            className={grid({
              columns: { base: 1, md: 2, lg: 3 },
              gap: "6",
            })}
          >
            {trips.map((trip) => {
              let bagColorClass = css({
                bg: "blue.50",
                color: "blue.600",
                _dark: { bg: "blue.950/40", color: "blue.400" },
              });

              const statusColorClass = css({
                bg: "green.50",
                color: "green.600",
                _dark: { bg: "green.950/40", color: "green.400" },
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
                  <div
                    className={flex({
                      justify: "space-between",
                      align: "flex-start",
                      mb: "3",
                    })}
                  >
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
                  <div
                    className={flex({
                      direction: "column",
                      gap: "2.5",
                      mt: "auto",
                    })}
                  >
                    <div
                      className={flex({
                        justify: "space-between",
                        align: "center",
                        fontSize: "xs",
                      })}
                    >
                      <span
                        className={css({
                          color: { base: "slate.500", _dark: "zinc.400" },
                          fontWeight: "medium",
                        })}
                      >
                        Packing Progress
                      </span>
                      <strong
                        className={css({
                          color: { base: "slate.900", _dark: "white" },
                        })}
                      >
                        {trip.packedItems} / {trip.totalItems} (
                        {trip.packedPercentage}%)
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
                          gradientFrom:
                            trip.status === "READY"
                              ? "green.400"
                              : "indigo.400",
                          gradientTo:
                            trip.status === "READY"
                              ? "emerald.500"
                              : "violet.500",
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
        )}
      </section>
    </main>
  );
}
