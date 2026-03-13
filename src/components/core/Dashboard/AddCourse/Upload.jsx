import { useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import { FiUploadCloud } from "react-icons/fi"
import { Player } from "video-react"
import "video-react/dist/video-react.css"

export default function Upload({
  name,
  label,
  register,
  setValue,
  errors,
  video = false,
  viewData = null,
  editData = null,
}) {
  const [previewSource, setPreviewSource] = useState(
    viewData || editData || ""
  )
  const [selectedFile, setSelectedFile] = useState(null)

  /* ---------- DROP HANDLER ---------- */
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return

    setSelectedFile(file)
    previewFile(file)

    // 🔥 THIS IS THE REAL FIX
    setValue(name, [file], {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: video
      ? { "video/*": [".mp4"] }
      : { "image/*": [".jpg", ".jpeg", ".png"] },
    multiple: false,
    onDrop,
  })

  /* ---------- PREVIEW ---------- */
  const previewFile = (file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setPreviewSource(reader.result)
    }
  }

  /* ---------- REGISTER FIELD ---------- */
  //useEffect(() => {
  //  register(name, { required: true })
  //}, [register, name])
  useEffect(() => {
    register(name, { 
      required: true,
      validate: (files) => {
        // 🔥 ADDED: Validate it's actually a File array
        return files && files[0] && files[0] instanceof File
      }
    })
  }, [register, name])


  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5">
        {label} <sup className="text-pink-200">*</sup>
      </label>

      <div
        {...getRootProps()}
        className={`${
          isDragActive ? "bg-richblack-600" : "bg-richblack-700"
        } flex min-h-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-richblack-500`}
      >
       
       <input {...getInputProps({ name })} /> 

        {previewSource ? (
          <div className="flex w-full flex-col p-6">
            {!video ? (
              <img
                src={previewSource}
                alt="Preview"
                className="h-full w-full rounded-md object-cover"
              />
            ) : (
              <Player playsInline src={previewSource} />
            )}

            {!viewData && (
              <button
                type="button"
                onClick={() => {
                  setPreviewSource("")
                  setSelectedFile(null)
                  setValue(name, null, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }}
                className="mt-3 text-richblack-400 underline"
              >
                Cancel
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center p-6">
            <div className="grid aspect-square w-14 place-items-center rounded-full bg-pure-greys-800">
              <FiUploadCloud className="text-2xl text-yellow-50" />
            </div>
            <p className="mt-2 max-w-[200px] text-center text-sm text-richblack-200">
              Drag and drop an {!video ? "image" : "video"}, or click to{" "}
              <span className="font-semibold text-yellow-50">Browse</span>
            </p>
            <ul className="mt-10 flex list-disc justify-between space-x-12 text-center text-xs text-richblack-200">
              <li>Aspect ratio 16:9</li>
              <li>Recommended size 1024x576</li>
            </ul>
          </div>
        )}
      </div>

      {errors[name] && (
        <span className="text-xs text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  )
}

//82 line cahnge with frontend
