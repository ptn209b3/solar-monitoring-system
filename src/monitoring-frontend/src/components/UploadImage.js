import React from "react";
import { Button } from "@mui/material";

export default function UploadImage() {
  const [images, setImages] = React.useState([]);
  const [selectedFiles] = React.useState();

  const handleChange = (e) => {
    let newImages = [...e.target.files].map((file) =>
      URL.createObjectURL(file)
    );
    setImages(newImages);
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("File", selectedFiles);
  };

  React.useEffect(() => {
    console.log(images.length);
  }, [images]);

  const myImages = images.length
    ? images.map((image, i) => (
        <img
          src={image}
          key={i}
          style={{ width: 400, height: 300 }}
          alt="wtf"
        />
      ))
    : [...Array(3)].map((e, i) => (
        <div style={{ width: 400, height: 300 }} key={i}>
          {i}
        </div>
      ));

  return (
    <div>
      <label htmlFor="upload-image">
        <input
          type="file"
          id="upload-image"
          accept="image/*"
          onChange={handleChange}
          multiple
          style={{ display: "none" }}
        />
        <Button variant="contained" component="span" onClick={handleSubmit}>
          Upload
        </Button>
      </label>

      <div style={{ position: "relative", border: "1px solid black" }}>
        {myImages}
      </div>
    </div>
  );
}
