import { useSelector } from 'react-redux'

const Notification = () => {
  const info = useSelector(state => state.notification)

  if (!info) {
    return;
  }

  const style = {
    color: info.type === "error" ? "red" : "green",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  return <div style={style}>{info}</div>;
};

export default Notification;
