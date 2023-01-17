import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { FormField } from "~/components/FormField";
import { Modal } from "~/components/Modal";
import { SelectBox } from "~/components/SelectBox";
import { getUser } from "~/utils/auth.server";
import { departments } from "~/utils/constants";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  return json({ user });
};

export default function ProfileSettings() {
  const { user } = useLoaderData();

  const [formData, setFormData] = useState({
    firstName: user.profile.firstName,
    lastName: user.profile.lastName,
    department: user.profile.department || "Marketing",
  });

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData((form) => ({ ...form, [field]: event.target.value }));
  };

  return (
    <Modal isOpen={true} className="w-1/3">
      <div className="p-3">
        <h2 className="text-4xl font-semibold text-blue-600 text-center mb-4">
          Your Profile
        </h2>
        <div className="flex">
          <div className="flex-1">
            <form method="post">
              <FormField
                htmlFor="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange(e, "firstName")}
              />
              <FormField
                htmlFor="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange(e, "lastName")}
              />
              <SelectBox
                className="w-full rounded-xl px-3 py-2 text-gray-400"
                id="department"
                label="Department"
                name="department"
                options={departments}
                value={formData.department}
                onChange={(e) => handleInputChange(e, "department")}
              />
              <div className="w-full text-right mt-4">
                <button className="rounded-xl bg-yellow-300 font-semibold text-blue-600 px-16 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:translate-y-1">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
}
