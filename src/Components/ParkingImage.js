import ImageHotspots from "react-image-hotspots";
import img from "../images/parking.jpg";
function ParkingImage() {
  return (
    <ImageHotspots
      src={img}
      id="test"
      alt="Sample image"
      hideMinimap={true}
      hotspots={[
        { x: 290, y: 290, content: <span>Hotspot 1</span> },
        { x: 40, y: 70, content: <span>Hotspot 2</span> },
        { x: 80, y: 30, content: <span>Hotspot 2</span> },
      ]}
    />
  );
}

export default ParkingImage;
