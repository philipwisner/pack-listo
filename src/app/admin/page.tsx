import { requireAdminUser } from "@/lib/auth";
import {
  getDefaultCategories,
  getDefaultItems,
  getDefaultBagTypes,
} from "@/features/admin/admin.defaults";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
  createBagTypeAction,
  updateBagTypeAction,
  deleteBagTypeAction,
  createItemAction,
  updateItemAction,
  deleteItemAction,
} from "@/features/admin/admin.actions";
import { Button } from "@/components/Button/Button";
import { Input } from "@/components/TextInput/TextInput";
import { InputLabel } from "@/components/InputLabel/InputLabel";
import { InternalLink } from "@/components/InternalLink/InternalLink";
import { css } from "@/styled-system/css";
import { flex, grid } from "@/styled-system/patterns";

export default async function AdminPage() {
  const user = await requireAdminUser();
  const [categories, bagTypes, items] = await Promise.all([
    getDefaultCategories(),
    getDefaultBagTypes(),
    getDefaultItems(),
  ]);

  return (
    <main
      className={flex({
        direction: "column",
        minHeight: "100vh",
        px: { base: "4", md: "8" },
        py: "8",
        gap: "8",
        bg: { base: "slate.50", _dark: "zinc.950" },
      })}
    >
      <div
        className={flex({
          justify: "space-between",
          align: "center",
          gap: "4",
        })}
      >
        <div>
          <p
            className={css({
              color: "indigo.500",
              fontSize: "sm",
              fontWeight: "semibold",
              mb: "2",
            })}
          >
            Admin Console
          </p>
          <h1
            className={css({
              fontSize: "3xl",
              fontWeight: "extrabold",
              color: { base: "slate.900", _dark: "white" },
            })}
          >
            Default Global Templates
          </h1>
          <p
            className={css({
              color: { base: "slate.600", _dark: "zinc.400" },
              maxWidth: "3xl",
              mt: "2",
            })}
          >
            Signed in as {user.email}. These are the shared categories, bag
            types, and items that are cloned into every new user account when
            they sign up.
          </p>
        </div>
        <InternalLink text="Back to Dashboard" url="/dashboard" />
      </div>

      <section className={grid({ columns: { base: 1, lg: 2 }, gap: "6" })}>
        <div
          className={css({
            bg: { base: "white", _dark: "zinc.900/60" },
            border: "1px solid",
            borderColor: { base: "slate.200", _dark: "zinc.800" },
            p: "6",
            rounded: "3xl",
            shadow: "sm",
          })}
        >
          <h2 className={css({ fontSize: "2xl", fontWeight: "bold", mb: "4" })}>
            Categories
          </h2>

          <form
            action={createCategoryAction}
            className={flex({ direction: "column", gap: "3", mb: "6" })}
          >
            <InputLabel htmlFor="category-name" label="New category name" />
            <Input
              id="category-name"
              name="name"
              placeholder="e.g. Clothing"
              required
            />
            <InputLabel htmlFor="category-icon" label="Icon" />
            <Input id="category-icon" name="icon" placeholder="e.g. shirt" />
            <InputLabel htmlFor="category-color" label="Color" />
            <Input
              id="category-color"
              name="color"
              placeholder="e.g. #4f46e5"
            />
            <Button text="Create category" type="submit" />
          </form>

          {categories.length === 0 ? (
            <p className={css({ color: "slate.500" })}>
              No global categories yet.
            </p>
          ) : (
            <div className={grid({ columns: { base: 1, sm: 2 }, gap: "4" })}>
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={css({
                    bg: { base: "white", _dark: "zinc.900/60" },
                    border: "1px solid",
                    borderColor: { base: "slate.200", _dark: "zinc.800" },
                    p: "5",
                    rounded: "3xl",
                    shadow: "sm",
                  })}
                >
                  <form
                    action={updateCategoryAction}
                    className={grid({ columns: { base: 1 }, gap: "4" })}
                  >
                    <input type="hidden" name="id" value={category.id} />
                    <div>
                      <InputLabel
                        htmlFor={`cat-name-${category.id}`}
                        label="Name"
                      />
                      <Input
                        id={`cat-name-${category.id}`}
                        name="name"
                        defaultValue={category.name}
                        required
                      />
                    </div>
                    <div>
                      <InputLabel
                        htmlFor={`cat-icon-${category.id}`}
                        label="Icon"
                      />
                      <Input
                        id={`cat-icon-${category.id}`}
                        name="icon"
                        defaultValue={category.icon ?? ""}
                        placeholder="icon"
                      />
                    </div>
                    <div>
                      <InputLabel
                        htmlFor={`cat-color-${category.id}`}
                        label="Color"
                      />
                      <Input
                        id={`cat-color-${category.id}`}
                        name="color"
                        defaultValue={category.color ?? ""}
                        placeholder="color"
                      />
                    </div>
                    <div
                      className={flex({
                        justify: "space-between",
                        align: "center",
                        gap: "3",
                        wrap: "wrap",
                      })}
                    >
                      <Button text="Save" type="submit" />
                      <span
                        className={css({ color: "slate.500", fontSize: "xs" })}
                      >
                        ID: {category.id}
                      </span>
                    </div>
                  </form>
                  <form
                    action={deleteCategoryAction}
                    className={css({
                      mt: "4",
                      display: "flex",
                      justifyContent: "flex-end",
                    })}
                  >
                    <input type="hidden" name="id" value={category.id} />
                    <Button text="Delete" type="submit" variant="secondary" />
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          className={css({
            bg: { base: "white", _dark: "zinc.900/60" },
            border: "1px solid",
            borderColor: { base: "slate.200", _dark: "zinc.800" },
            p: "6",
            rounded: "3xl",
            shadow: "sm",
          })}
        >
          <h2 className={css({ fontSize: "2xl", fontWeight: "bold", mb: "4" })}>
            Bag Types
          </h2>

          <form
            action={createBagTypeAction}
            className={flex({ direction: "column", gap: "3", mb: "6" })}
          >
            <InputLabel htmlFor="bagtype-name" label="New bag type name" />
            <Input
              id="bagtype-name"
              name="name"
              placeholder="e.g. Carry-on Backpack"
              required
            />
            <InputLabel htmlFor="bagtype-icon" label="Icon" />
            <Input id="bagtype-icon" name="icon" placeholder="e.g. briefcase" />
            <InputLabel htmlFor="bagtype-color" label="Color" />
            <Input id="bagtype-color" name="color" placeholder="e.g. #3b82f6" />
            <Button text="Create bag type" type="submit" />
          </form>

          {bagTypes.length === 0 ? (
            <p className={css({ color: "slate.500" })}>
              No global bag types yet.
            </p>
          ) : (
            <div className={grid({ columns: { base: 1, sm: 2 }, gap: "4" })}>
              {bagTypes.map((bagType) => (
                <div
                  key={bagType.id}
                  className={css({
                    bg: { base: "white", _dark: "zinc.900/60" },
                    border: "1px solid",
                    borderColor: { base: "slate.200", _dark: "zinc.800" },
                    p: "5",
                    rounded: "3xl",
                    shadow: "sm",
                  })}
                >
                  <form
                    action={updateBagTypeAction}
                    className={grid({ columns: { base: 1 }, gap: "4" })}
                  >
                    <input type="hidden" name="id" value={bagType.id} />
                    <div>
                      <InputLabel
                        htmlFor={`bagtype-name-${bagType.id}`}
                        label="Name"
                      />
                      <Input
                        id={`bagtype-name-${bagType.id}`}
                        name="name"
                        defaultValue={bagType.name}
                        required
                      />
                    </div>
                    <div>
                      <InputLabel
                        htmlFor={`bagtype-icon-${bagType.id}`}
                        label="Icon"
                      />
                      <Input
                        id={`bagtype-icon-${bagType.id}`}
                        name="icon"
                        defaultValue={bagType.icon ?? ""}
                        placeholder="icon"
                      />
                    </div>
                    <div>
                      <InputLabel
                        htmlFor={`bagtype-color-${bagType.id}`}
                        label="Color"
                      />
                      <Input
                        id={`bagtype-color-${bagType.id}`}
                        name="color"
                        defaultValue={bagType.color ?? ""}
                        placeholder="color"
                      />
                    </div>
                    <div
                      className={flex({
                        justify: "space-between",
                        align: "center",
                        gap: "3",
                        wrap: "wrap",
                      })}
                    >
                      <Button text="Save" type="submit" />
                      <span
                        className={css({ color: "slate.500", fontSize: "xs" })}
                      >
                        ID: {bagType.id}
                      </span>
                    </div>
                  </form>
                  <form
                    action={deleteBagTypeAction}
                    className={css({
                      mt: "4",
                      display: "flex",
                      justifyContent: "flex-end",
                    })}
                  >
                    <input type="hidden" name="id" value={bagType.id} />
                    <Button text="Delete" type="submit" variant="secondary" />
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section
        className={css({
          bg: { base: "white", _dark: "zinc.900/60" },
          border: "1px solid",
          borderColor: { base: "slate.200", _dark: "zinc.800" },
          p: "6",
          rounded: "3xl",
          shadow: "sm",
        })}
      >
        <h2 className={css({ fontSize: "2xl", fontWeight: "bold", mb: "4" })}>
          Items
        </h2>

        <form
          action={createItemAction}
          className={grid({ columns: { base: 1, md: 3 }, gap: "4", mb: "6" })}
        >
          <div>
            <InputLabel htmlFor="item-name" label="Name" />
            <Input
              id="item-name"
              name="name"
              placeholder="e.g. T-Shirt"
              required
            />
          </div>
          <div>
            <InputLabel htmlFor="item-defaultWeight" label="Default weight" />
            <Input
              id="item-defaultWeight"
              name="defaultWeight"
              placeholder="e.g. 0.5"
            />
          </div>
          <div>
            <InputLabel htmlFor="item-categories" label="Categories" />
            <select
              id="item-categories"
              name="categoryIds"
              multiple
              size={4}
              className={css({
                width: "100%",
                px: "3",
                py: "2.5",
                borderRadius: "md",
                border: "1px solid",
                borderColor: "input.border.default",
                background: "input.background.default",
              })}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div
            className={css({ gridColumn: { base: "span 1", md: "span 3" } })}
          >
            <Button text="Create item" type="submit" />
          </div>
        </form>

        {items.length === 0 ? (
          <p className={css({ color: "slate.500" })}>No global items yet.</p>
        ) : (
          <div
            className={grid({ columns: { base: 1, md: 2, xl: 3 }, gap: "4" })}
          >
            {items.map((item) => (
              <div
                key={item.id}
                className={css({
                  bg: { base: "white", _dark: "zinc.900/60" },
                  border: "1px solid",
                  borderColor: { base: "slate.200", _dark: "zinc.800" },
                  p: "5",
                  rounded: "3xl",
                  shadow: "sm",
                })}
              >
                <form
                  action={updateItemAction}
                  className={grid({ columns: { base: 1 }, gap: "4" })}
                >
                  <input type="hidden" name="id" value={item.id} />
                  <div>
                    <InputLabel htmlFor={`item-name-${item.id}`} label="Name" />
                    <Input
                      id={`item-name-${item.id}`}
                      name="name"
                      defaultValue={item.name}
                      required
                    />
                  </div>
                  <div>
                    <InputLabel
                      htmlFor={`item-defaultWeight-${item.id}`}
                      label="Default weight"
                    />
                    <Input
                      id={`item-defaultWeight-${item.id}`}
                      name="defaultWeight"
                      defaultValue={item.defaultWeight?.toString() ?? ""}
                    />
                  </div>
                  <div>
                    <InputLabel
                      htmlFor={`item-categories-${item.id}`}
                      label="Categories"
                    />
                    <select
                      id={`item-categories-${item.id}`}
                      name="categoryIds"
                      multiple
                      size={4}
                      className={css({
                        width: "100%",
                        px: "3",
                        py: "2.5",
                        borderRadius: "md",
                        border: "1px solid",
                        borderColor: "input.border.default",
                        background: "input.background.default",
                      })}
                    >
                      {categories.map((category) => (
                        <option
                          key={category.id}
                          value={category.id}
                          selected={item.categories.some(
                            (cat) => cat.id === category.id,
                          )}
                        >
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div
                    className={flex({
                      justify: "space-between",
                      align: "center",
                      gap: "3",
                      wrap: "wrap",
                    })}
                  >
                    <Button text="Save" type="submit" />
                    <span
                      className={css({ color: "slate.500", fontSize: "xs" })}
                    >
                      Item ID: {item.id}
                    </span>
                  </div>
                </form>
                <form
                  action={deleteItemAction}
                  className={css({
                    mt: "4",
                    display: "flex",
                    justifyContent: "flex-end",
                  })}
                >
                  <input type="hidden" name="id" value={item.id} />
                  <Button text="Delete" type="submit" variant="secondary" />
                </form>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
