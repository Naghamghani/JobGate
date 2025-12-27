import React from "react";
import { Button, Modal, Progress } from "antd";


export default function FileUploadModal({
  modalOpen,
  setModalOpen,
  getImage,
  uploadImage,
  currentImage,
  progress,
}) {
  return (
    <div>
      <Modal
        title="Add a Profile Image"
        centered
        open={modalOpen}
        onOk={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
        footer={[
          <Button
            disabled={currentImage.name ? false : true}
            key="submit"
            type="primary"
            onClick={uploadImage}
          >
            Upload Profile Picture
          </Button>,
        ]}
      >
        <div className="flex flex-col justify-center items-center h-auto">
          <p>{currentImage.name}</p>
          <label
            className="border border-[#212121] p-2.5 cursor-pointer font-['Inter'] mt-2 rounded hover:bg-gray-50 transition-colors"
            htmlFor="image-upload"
          >
            Add an Image
          </label>
          {progress === 0 ? (
            <></>
          ) : (
            <div className="p-5">
              <Progress type="circle" percent={progress} />
            </div>
          )}
          <input hidden id="image-upload" type={"file"} onChange={getImage} />
        </div>
      </Modal>
    </div>
  );
}
