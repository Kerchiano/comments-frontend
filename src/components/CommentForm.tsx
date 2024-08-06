import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  CommentErrors,
  CommentFormProps,
  FormData,
} from "../types/commentTypes";

const CommentForm = ({ parentId, fetchComments, onSuccess  }: CommentFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    home_page: "",
    text: "",
    captcha_text: "",
  });
  const [captchaImage, setCaptchaImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [success, setSuccess] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    const updateCaptcha = () => {
      const captchaUrl = `http://127.0.0.1:8000/api/generate-captcha/?${new Date().getTime()}`;
      setCaptchaImage(captchaUrl);
    };

    updateCaptcha();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setIsVisible(false); 
        if (onSuccess) {
          onSuccess();
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const validateFields = (): boolean => {
    const newErrors: Partial<FormData> = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      if (key !== "home_page" && !formData[key as keyof FormData]) {
        newErrors[key as keyof FormData] = `${key.replace(
          "_",
          " "
        )} is required`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [id]: "" }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!validateFields()) {
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/comments/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          parent_id: parentId || null,
        }),
      });

      if (!response.ok) {
        const errorData: CommentErrors = await response.json();
        throw new Error(JSON.stringify(errorData));
      }

      setSuccess("Comment added successfully!");
      fetchComments();
      setFormData({
        username: "",
        email: "",
        home_page: "",
        text: "",
        captcha_text: "",
      });
      setErrors({});

      const newCaptchaUrl = `http://127.0.0.1:8000/api/generate-captcha/?${new Date().getTime()}`;
      setCaptchaImage(newCaptchaUrl);
    } catch (err) {
      if (err instanceof Error) {
        const errorData: Partial<FormData> = JSON.parse(err.message);
        setErrors((prevErrors) => ({ ...prevErrors, ...errorData }));
      }
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="max-w-md min-w-96 w-1/4 mx-auto p-4 bg-white shadow-md rounded-lg text-left mb-10">
      <h2 className="text-xl font-bold mb-4 text-center">Add a Comment</h2>
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <form onSubmit={handleSubmit}>
        {["username", "email"].map((field) => (
          <div className="mb-4" key={field}>
            <label
              htmlFor={field}
              className="block text-sm font-medium text-gray-700"
            >
              {field.replace("_", " ").charAt(0).toUpperCase() +
                field.replace("_", " ").slice(1)}
            </label>
            <input
              id={field}
              type={field === "email" ? "email" : "text"}
              value={formData[field as keyof FormData]}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors[field as keyof FormData]
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors[field as keyof FormData] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[field as keyof FormData]}
              </p>
            )}
          </div>
        ))}
        <div className="mb-4">
          <label
            htmlFor="home_page"
            className="block text-sm font-medium text-gray-700"
          >
            Home page (optional)
          </label>
          <input
            id="home_page"
            type="url"
            value={formData.home_page || ""}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-2">
          <label
            htmlFor="text"
            className="block text-sm font-medium text-gray-700"
          >
            Comment
          </label>
          <textarea
            id="text"
            value={formData.text}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.text ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            rows={2}
          />
          {errors.text && (
            <p className="text-red-500 text-sm mt-1">{errors.text}</p>
          )}
        </div>
        {captchaImage && (
          <div className="mb-4">
            <div className="flex justify-center h-16 border rounded mb-2">
              <img src={captchaImage} alt="CAPTCHA" className="mb-2 w-48" />
            </div>
            <input
              id="captcha_text"
              type="text"
              value={formData.captcha_text}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.captcha_text ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.captcha_text && (
              <p className="text-red-500 text-sm mt-1">{errors.captcha_text}</p>
            )}
          </div>
        )}
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit Comment
        </button>
      </form>
    </div>
  );
};

export default CommentForm;
