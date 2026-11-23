"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Camera, MapPin, Pencil, X } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { authClient } from "@/lib/auth-client";

interface EditProfileProps {
  user: {
    name: string;
    email: string;
    image: string;
  };
  memberSince: string;
}

export default function EditProfile({ user, memberSince }: EditProfileProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(user.name);
  const [image, setImage] = useState(user.image);
  const [saving, setSaving] = useState(false);

  const handleOpen = () => {
    setName(user.name);
    setImage(user.image);
    setOpen(true);
  };

  const handleUpdateProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await authClient.updateUser({
        name: name.trim(),
        image: image.trim(),
      });

      if (error) {
        toast.error(error.message || "Could not update profile.");
        return;
      }

      toast.success("Profile updated successfully!");
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <aside className="border border-neutral-100 bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name || "User profile"}
              width={112}
              height={112}
              unoptimized
              className="size-28 rounded-full object-cover"
            />
          ) : (
            <div className="flex size-28 items-center justify-center rounded-full bg-neutral-200 text-3xl font-medium text-neutral-600">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
          )}

          <button
            type="button"
            onClick={handleOpen}
            aria-label="Change profile photo"
            className="absolute right-0 bottom-1 flex size-8 cursor-pointer items-center justify-center rounded-full bg-[#13A5BF] text-white shadow-sm transition-colors hover:bg-[#108da4]"
          >
            <Camera className="size-4" aria-hidden="true" />
          </button>
        </div>

        <h2 className="mt-4 font-serif text-lg font-medium text-neutral-950">
          {user.name || "Traveler"}
        </h2>
        <p className="mt-1 flex items-center gap-1 text-xs text-neutral-500">
          <MapPin className="size-3.5" aria-hidden="true" />
          {user.email}
        </p>
      </div>

      <hr className="my-5 border-neutral-100" />

      <div className="space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-neutral-500">Member since</span>
          <span className="font-semibold text-neutral-900">{memberSince}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-neutral-500">Nationality</span>
          <span className="font-semibold text-neutral-900">Bangladesh</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleOpen}
        className="mt-6 flex h-10 w-full cursor-pointer items-center justify-center gap-2 bg-[#13A5BF] text-xs font-medium text-white transition-colors hover:bg-[#108da4]"
      >
        <Pencil className="size-3.5" aria-hidden="true" />
        Edit Profile
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-md rounded-sm bg-white p-6 shadow-lg">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close modal"
              className="absolute top-4 right-4 cursor-pointer text-neutral-400 transition-colors hover:text-neutral-700"
            >
              <X className="size-4" />
            </button>

            <h3 className="font-serif text-xl font-medium text-neutral-950">
              Edit Profile
            </h3>
            <p className="mt-1 text-xs text-neutral-500">
              Update your name and profile photo URL
            </p>

            <form onSubmit={handleUpdateProfile} className="mt-5 space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="profile-name"
                  className="block text-xs font-medium text-neutral-800"
                >
                  Full Name
                </label>
                <input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter your name"
                  className="h-10 w-full border border-neutral-200 bg-[#f5f7f9] px-3 text-xs text-neutral-900 outline-none focus:border-[#13A5BF]"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="profile-image"
                  className="block text-xs font-medium text-neutral-800"
                >
                  Profile Image URL
                </label>
                <input
                  id="profile-image"
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="h-10 w-full border border-neutral-200 bg-[#f5f7f9] px-3 text-xs text-neutral-900 outline-none focus:border-[#13A5BF]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => setOpen(false)}
                  className="h-9 cursor-pointer border border-neutral-200 px-4 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="h-9 cursor-pointer bg-[#13A5BF] px-4 text-xs font-medium text-white transition-colors hover:bg-[#108da4] disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} theme="light" />
    </aside>
  );
}