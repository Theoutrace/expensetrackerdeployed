import React from "react";

const SingleVersionItem = (props) => {
  const item = props.item;
  const versionClickhandler = () => {
    const a = document.createElement("a");
    a.href = item.fileUrl;
    a.download = "file.csv";
    a.click();
  };
  return <div onClick={versionClickhandler}>{item.fileName}</div>;
};

export default SingleVersionItem;
