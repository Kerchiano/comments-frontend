import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { ICommentFormProps, IFormErrors } from "../types/commentTypes";
import type { IFormData } from "../types/commentTypes";

const CommentForm = ({
  parentId,
  fetchComments,
  onSuccess,
  socket,
}: ICommentFormProps) => {
  const [formData, setFormData] = useState<IFormData>({
    username: "",
    email: "",
    home_page: "",
    text: "",
    captcha_text: "",
    image: null,
    file: null,
  });
  const [captchaImage, setCaptchaImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<IFormErrors>({});
  const [success, setSuccess] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    const updateCaptcha = () => {
      const captchaUrl = `http://127.0.0.1:8000/api/generate-captcha/?${new Date().getTime()}`;
      setCaptchaImage(captchaUrl);
    };

    updateCaptcha();
  }, []);

  useEffect(() => {
    if (success) {
      setIsVisible(false);
      const executeOnSuccess = new Promise<void>((resolve) => {
        if (onSuccess) {
          onSuccess();
        }
        resolve();
      });

      executeOnSuccess.then(() => {
        setTimeout(() => {
          alert(success);
        }, 300);
      });
    }
  }, [success]);

  const validateFields = (): boolean => {
    const newErrors: IFormErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      if (
        key !== "home_page" &&
        key !== "image" &&
        key !== "file" &&
        !formData[key as keyof IFormData]
      ) {
        newErrors[key as keyof IFormErrors] = `${key.replace(
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

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: "image" | "file"
  ) => {
    const file = e.target.files?.[0] || null;
    setFormData((prevData) => ({ ...prevData, [field]: file }));
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));

    if (field === "image") {
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {};
        reader.readAsDataURL(file);
      } else {
        setModalImage(null);
      }
    }
    if (file) {
      setFileName(file.name);
    } else {
      setFileName(null);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!validateFields()) {
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("username", formData.username);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("home_page", formData.home_page || "");
    formDataToSend.append("text", formData.text);
    formDataToSend.append("captcha_text", formData.captcha_text);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }
    if (formData.file) {
      formDataToSend.append("file", formData.file);
    }
    if (parentId) {
      formDataToSend.append("parent_id", parentId.toString());
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/comments/", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors(errorData);
        throw new Error(JSON.stringify(errorData));
      }

      const commentData = await response.json();

      fetchComments();
      setSuccess("Comment added successfully!");
      setFormData({
        username: "",
        email: "",
        home_page: "",
        text: "",
        captcha_text: "",
        image: null,
        file: null,
      });
      setErrors({});

      if (socket) {
        socket.send(JSON.stringify({ message: commentData }));
      }

      const newCaptchaUrl = `http://127.0.0.1:8000/api/generate-captcha/?${new Date().getTime()}`;
      setCaptchaImage(newCaptchaUrl);
    } catch (err) {
      if (err instanceof Error) {
        const errorData: IFormErrors = JSON.parse(err.message);
        setErrors((prevErrors) => ({ ...prevErrors, ...errorData }));
      }
    }
  };

  const openModal = (imageUrl: string) => {
    setModalImage(imageUrl);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="max-w-md min-w-96 w-1/4 mx-auto p-4 bg-white shadow-md rounded-lg text-left mb-10">
      <h2 className="text-xl font-bold mb-4 text-center">Add a Comment</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.username ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

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
            value={formData.home_page}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            Image file (optional)
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "image")}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.image ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          />
          {formData.image && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(formData.image)}
                alt="Uploaded"
                className="cursor-pointer"
                style={{ width: 90, height: 90 }}
                onClick={() => openModal(URL.createObjectURL(formData.image!))}
              />
            </div>
          )}
          {errors.image && (
            <p className="text-red-500 text-sm mt-1">{errors.image}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="file"
            className="block text-sm font-medium text-gray-700"
          >
            Other file (optional)
          </label>
          <input
            id="file"
            type="file"
            onChange={(e) => handleFileChange(e, "file")}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.file ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          />
          {formData.file && (
            <div className="mt-2">
              <p>
                <a
                  href={URL.createObjectURL(formData.file)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 text-sm hover:underline"
                >
                  {fileName}
                </a>
              </p>
            </div>
          )}
          {errors.file && (
            <p className="text-red-500 text-sm mt-1">{errors.file}</p>
          )}
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

        <div className="mb-4">
          <img
            src={captchaImage || ""}
            alt="Captcha"
            className="mb-2 cursor-pointer"
            onClick={() =>
              setCaptchaImage(
                `http://127.0.0.1:8000/api/generate-captcha/?${new Date().getTime()}`
              )
            }
          />
          <input
            id="captcha_text"
            type="text"
            value={formData.captcha_text}
            onChange={handleChange}
            placeholder="Enter CAPTCHA"
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.captcha_text ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          />
          {errors.captcha_text && (
            <p className="text-red-500 text-sm mt-1">{errors.captcha_text}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </form>

      {modalImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="max-w-4/5 max-h-4/5">
              <img
                src={modalImage}
                alt="Modal"
                className="w-3/5 h-auto min-w-96 mx-auto"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentForm;
