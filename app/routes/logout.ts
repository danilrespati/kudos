import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "react-router";
import { logout } from "~/utils/auth.server";

export const loader: LoaderFunction = async () => {
  return redirect("/");
};

export const action: ActionFunction = async ({ request }) => {
  return logout(request);
};
