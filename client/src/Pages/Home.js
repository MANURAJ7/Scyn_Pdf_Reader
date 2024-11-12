import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home({ socket, roomDetails, setRoomDetails }) {
  const navigate = useNavigate();
  const [url, setUrl] = useState(null);
  const [roomId, setRoomId] = useState(null);
  useEffect(() => {
    if (socket) {
      socket.on("join_room_res_event", (pageNo, isAdmin, url, newRoomId) => {
        if (pageNo === -1) {
          alert("Error: Room doesn't exist.");
        } else {
          setRoomDetails({
            roomId: newRoomId,
            pageNo: pageNo,
            isAdmin: isAdmin,
            url: url,
          });
          navigate("/Room");
        }
      });
    }
  }, [socket, roomDetails, navigate]);

  function handleCreate(e) {
    e.preventDefault();
    if (socket) {
      socket.emit("create_room", roomId, url);
    }
  }
  function handleJoin(e) {
    e.preventDefault();
    if (socket) {
      socket.emit("join_room_req_event", roomId);
    }
  }

  return (
    <div className="mx-auto my-auto text-zinc-200">
      <form>
        <label>Room Id:</label>
        <br />
        <input
          className="bg-zinc-200 mb-8 text-black"
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <br />
        <label>URL :</label>
        <br />
        <input
          className="bg-zinc-200 mb-6 text-black"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <br />
        <button
          type="submit"
          className="bg-zinc-200 text-black mr-4 px-1.5"
          onClick={handleCreate}
          disabled={!url}
        >
          Create Room
        </button>
        <button
          type="submit"
          className="bg-zinc-200 text-black px-1.5"
          onClick={handleJoin}
        >
          Join Room
        </button>
      </form>
    </div>
  );
}

export default Home;
