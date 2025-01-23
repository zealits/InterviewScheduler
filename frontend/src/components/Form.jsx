import React from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import TimezoneSelect from "react-timezone-select";
import { addInterviewer } from "../utils/api"; // Ensure correct path for this import

const Form = () => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();
  const [timezone, setTimezone] = React.useState("");

  const specializationOptions = [
    { value: "Software Engineering", label: "Software Engineering" },
    { value: "Frontend", label: "Frontend" },
    { value: "Backend", label: "Backend" },
    { value: "Fullstack", label: "Fullstack" },
  ];

  const modeOptions = [
    { value: "online", label: "Online" },
    { value: "offline", label: "Offline" },
  ];
  const onFormSubmit = async (data) => {
    const availability = [
      {
        date: data.date, // Ensure this is in 'YYYY-MM-DD' format
        time: data.time, // Use 'HH:mm' format
        timezone: timezone.value, // Valid IANA timezone string
        mode: data.mode, // Should match 'online' or 'offline'
      },
    ];

    const payload = {
      name: data.name,
      email: data.email,
      contactNumber: data.contactNumber,
      specialization: data.specialization,
      experience:data.experience,
      availability,
      remarks: data.remarks,
    };

    console.log("Payload to be sent:", payload);

    try {
      const response = await addInterviewer(payload);
      console.log("Interviewer added successfully:", response);
      alert("Interviewer added successfully!");
    } catch (error) {
      console.error("Error adding interviewer:", error);
      alert("Failed to add interviewer. Please try again.");
    }
  };

  //   const onFormSubmit = async (data) => {
  //     const availability = [
  //       {
  //         date: data.date,
  //         time: data.time,
  //         timezone: timezone.value,
  //         mode: data.mode,
  //       },
  //     ];

  //     const payload = {
  //       name: data.name,
  //       email: data.email,
  //       contactNumber: data.contactNumber,
  //       specialization: data.specialization,
  //       availability,
  //       remarks: data.remarks,
  //     };

  //     console.log("Form data payload:", payload);

  //     try {
  //       const response = await addInterviewer(payload);
  //       console.log("Interviewer added successfully:", response);
  //       alert("Interviewer added successfully!");
  //     } catch (error) {
  //       console.error("Error adding interviewer:", error);
  //       alert("Failed to add interviewer. Please try again.");
  //     }
  //   };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="max-w-lg mx-auto p-6 bg-white rounded-md shadow-md space-y-4"
    >
      <h2 className="text-xl font-semibold text-center">Interviewer Form</h2>

      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          {...register("name", { required: "Name is required" })}
          placeholder="Enter your name"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          {...register("email", { required: "Email is required" })}
          placeholder="Enter your email"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Contact Number</label>
        <input
          {...register("contactNumber", {
            required: "Contact number is required",
          })}
          placeholder="Enter your contact number"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.contactNumber && (
          <p className="text-red-500 text-sm">{errors.contactNumber.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Specialization</label>
        <Controller
          name="specialization"
          control={control}
          rules={{ required: "Specialization is required" }}
          render={({ field }) => (
            <Select
              {...field}
              options={specializationOptions}
              value={specializationOptions.find(
                (option) => option.value === field.value
              )}
              onChange={(selectedOption) =>
                field.onChange(selectedOption?.value)
              }
            />
          )}
        />
        {errors.specialization && (
          <p className="text-red-500 text-sm">
            {errors.specialization.message}
          </p>
        )}
      </div>

      <div>
    <label className="block text-sm font-medium">Experience (in years)</label>
    <input
      {...register("experience", {
        required: "Experience is required",
        pattern: {
          value: /^[0-9]+$/,
          message: "Experience must be a valid number",
        },
      })}
      placeholder="Enter years of experience"
      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    {errors.experience && (
      <p className="text-red-500 text-sm">{errors.experience.message}</p>
    )}
  </div>


      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Date</label>
          <input
            {...register("date", { required: "Date is required" })}
            type="date"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.date && (
            <p className="text-red-500 text-sm">{errors.date.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Time</label>
          <input
            {...register("time", { required: "Time is required" })}
            type="time"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.time && (
            <p className="text-red-500 text-sm">{errors.time.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Mode</label>
        <Controller
          name="mode"
          control={control}
          rules={{ required: "Mode is required" }}
          render={({ field }) => (
            <Select
              {...field}
              options={modeOptions}
              value={modeOptions.find(
                (option) => option.value === field.value
              )}
              onChange={(selectedOption) =>
                field.onChange(selectedOption?.value)
              }
            />
          )}
        />
        {errors.mode && (
          <p className="text-red-500 text-sm">{errors.mode.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Timezone</label>
        <TimezoneSelect
          value={timezone}
          onChange={(value) => {
            setTimezone(value);
          }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Remarks</label>
        <textarea
          {...register("remarks")}
          placeholder="Additional comments or remarks"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
      >
        Submit
      </button>
    </form>
  );
};

export default Form;
