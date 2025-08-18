import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer";

export const Panoram = ({ src }: { src: string }) => {
  return <ReactPhotoSphereViewer src={src} height="400px" width="100%" />;
};

export default Panoram;
