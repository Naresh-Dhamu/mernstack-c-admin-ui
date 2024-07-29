import {
  Form,
  message,
  Progress,
  Space,
  Spin,
  Typography,
  Upload,
  UploadProps,
} from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { SetStateAction, useState } from "react";
import imageCompression from "browser-image-compression";
const ProductImage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const uploaderConfig: UploadProps = {
    name: "file",
    multiple: false,
    showUploadList: false,
    beforeUpload: async (file) => {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        messageApi.error("You can only upload JPG/PNG file!");
        return false;
      }
      setLoading(true);
      setProgress(0);
      try {
        const options = {
          maxSizeMB: 0.5, // Maximum size in MB
          maxWidthOrHeight: 1920, // Maximum width or height
          initialQuality: 0.7,
          useWebWorker: true, // Use web worker for faster compression
          onProgress: (p: SetStateAction<number>) => setProgress(p),
        };

        const compressedFile = await imageCompression(file, options);
        const compressedFileUrl = URL.createObjectURL(compressedFile);
        setImageUrl(compressedFileUrl);

        return true; // Indicate success
      } catch (error) {
        messageApi.error("Image compression failed!");
        return false;
      } finally {
        setLoading(false);
      }
    },
  };
  return (
    <Form.Item
      label="Product Image"
      name="image"
      rules={[
        {
          required: true,
          message: "Please upload your product image!",
        },
      ]}
    >
      <Upload listType="picture-card" accept="image/*" {...uploaderConfig}>
        {contextHolder}
        {loading ? (
          <div>
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            />
            <Progress percent={progress} status="active" />
          </div>
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt="product image"
            style={{ width: "100%", padding: "10px" }}
          />
        ) : (
          <Space direction="vertical">
            <PlusOutlined />
            <Typography.Text>Upload</Typography.Text>
          </Space>
        )}
      </Upload>
    </Form.Item>
  );
};

export default ProductImage;
