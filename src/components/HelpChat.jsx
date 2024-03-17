import { Button, useColorModeValue } from "@chakra-ui/react";
import { io } from "socket.io-client";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { useEffect } from "react";
import Draggable from "react-draggable";
import { API, socketURL } from "../services/services";
import { NavLink } from "react-router-dom";

const socket = io(socketURL);

const HelpChat = ({ load, setLoad }) => {
  const textColor = useColorModeValue("#E2E8F0", "#2D3748");
  const bgColor = useColorModeValue("#2D3748", "#E2E8F0");
  const { user } = useAuth();
  const [chatMessage, setChatMessage] = useState({
    name: user.nick,
    msg: "",
    byAdmin: user.admin,
    room: "HelpChat",
  });
  const [convos, setConvos] = useState([]);
  const [target, setTarget] = useState();
  const [msgList, setMsgList] = useState([]);
  const [id, setId] = useState("");

  useEffect(() => {
    socket.emit("userJoin", { username: user.nick, id: "HelpChat" });
    return () =>
      socket.emit("roomLeave", { username: user.nick, id: "HelpChat" });
  }, []);

  useEffect(() => {
    const getId = async () => {
      try {
        const res = await API.post("user/nick", {
          nick: target,
        });
        setId(res.data.message);
      } catch (error) {
        setId("");
      }
    };

    if (target) getId();
  }, [target]);

  const handleChange = (e) => {
    setChatMessage({ ...chatMessage, [e.target.name]: e.target.value });
  };

  socket.on("newMessage", (newMessage) => {
    if (user.admin || newMessage.byAdmin || newMessage.name === user.nick) {
      setMsgList([
        ...msgList,
        {
          name: newMessage.name,
          msg: newMessage.msg,
          byAdmin: newMessage.byAdmin,
          room: "HelpChat",
          target: newMessage.target,
        },
      ]);
      setLoad(true);
    }
  });

  const newMessageSubmit = async (e) => {
    e.preventDefault();
    const newMessage = {
      name: chatMessage.name,
      msg: chatMessage.msg,
      byAdmin: user.admin,
      room: "HelpChat",
      target: target,
    };

    socket.emit("newMessage", newMessage);

    setChatMessage({
      name: user.nick,
      msg: "",
      room: "HelpChat",
      target: "",
    });
  };

  const filteredList = user.admin
    ? [...msgList.filter((msg) => !msg.byAdmin)]
    : [
        ...msgList.filter(
          (msg) => msg.target === user.nick || msg.name === user.nick
        ),
      ];

  const handleNewChat = async (target) => {
    if (user.admin && target !== user.nick && !convos.includes(target)) {
      setConvos((prev) => [...prev, target]);
      setTarget(target);
    }
  };

  const renderNewChat = (tgt) => {
    const handlePopoutClose = () => {
      setConvos((prev) => prev.filter((convo) => convo !== tgt));
      setMsgList((prev) =>
        prev.filter((msg) => {
          if (msg.name === tgt) return false;
          if (msg.target === tgt) return false;
          return true;
        })
      );
    };

    return (
      <Draggable>
        <div className="chat-popout">
          <div
            style={{
              backgroundColor: "#2D3748",
              color: "#CBD5E0",
              padding: "6px",
            }}
          >
            <NavLink to={`/tickets/${id}/profile`}>
              <h1 style={{ fontSize: "1.25rem", padding: "4px 0px 0px 4px" }}>
                <b>{tgt}</b>
              </h1>
            </NavLink>
            <button
              onClick={() => setTarget("")}
              style={{
                fontSize: "1.5rem",
                position: "absolute",
                top: "-2px",
                right: "36px",
              }}
            >
              _
            </button>
            <button
              onClick={handlePopoutClose}
              style={{
                position: "absolute",
                top: "10px",
                right: "14px",
                fontSize: "1.25rem",
              }}
            >
              <b>X</b>
            </button>
          </div>
          <div className="help-chat">
            <div className="help-chat--chat">
              <ul style={{ listStyleType: "none" }}>
                {[...msgList]
                  .filter(
                    (msg) =>
                      (msg.byAdmin && msg.target === tgt) || msg.name === tgt
                  )
                  .map((msg, index) => {
                    const date = `${new Date().toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    })} ${new Date().toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`;
                    return (
                      <li key={index}>
                        {date === "Invalid Date Invalid Date" ? (
                          ""
                        ) : (
                          <>
                            <b>{msg.name} </b>
                            <span
                              style={{
                                fontSize: "0.9rem",
                                color: "#CBD5E0",
                                marginLeft: "5px",
                              }}
                            >
                              {date}
                            </span>
                            <h5>{msg.msg}</h5>
                          </>
                        )}
                      </li>
                    );
                  })}
              </ul>
            </div>
            {target === tgt && (
              <form
                onSubmit={newMessageSubmit}
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="text"
                  style={{ backgroundColor: bgColor, color: textColor }}
                  name="msg"
                  value={chatMessage.msg}
                  onChange={handleChange}
                  required
                />
                <Button style={{ fontSize: "1.5rem" }} type="submit">
                  Enviar
                </Button>
              </form>
            )}
          </div>
        </div>
      </Draggable>
    );
  };

  return (
    <div style={{ display: `${load ? "block" : "none"}` }}>
      <div className="help-chat">
        <div className="help-chat--chat">
          <ul style={{ listStyleType: "none" }}>
            {[...filteredList]
              .filter((msg) => !convos.includes(msg.name))
              .map((msg, index) => {
                const date = `${new Date().toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                })} ${new Date().toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`;
                return (
                  <li key={index}>
                    {date === "Invalid Date Invalid Date" ? (
                      ""
                    ) : (
                      <>
                        <b
                          style={{ cursor: "pointer" }}
                          onClick={() => handleNewChat(msg.name)}
                        >
                          {msg.name}{" "}
                        </b>
                        <span style={{ fontSize: "12px", color: "#CBD5E0" }}>
                          {date}
                        </span>
                        <h5 style={{ color: "white" }}>{msg.msg}</h5>
                      </>
                    )}
                  </li>
                );
              })}
          </ul>
        </div>
        {!user.admin && (
          <form
            onSubmit={newMessageSubmit}
            style={{ display: "flex", alignItems: "center" }}
          >
            <input
              type="text"
              style={{ backgroundColor: bgColor, color: textColor }}
              name="msg"
              value={chatMessage.msg}
              onChange={handleChange}
              required
            />
            <Button style={{ fontSize: "1.5rem" }} type="submit">
              Enviar
            </Button>
          </form>
        )}
      </div>
      {user.admin && (
        <div className="conversations">
          {convos.map((tgt, key) => {
            const convo = [...msgList]
              .filter(
                (msg) => (msg.byAdmin && msg.target === tgt) || msg.name === tgt
              )
              .slice(-1)[0].name;
            if (tgt === target)
              return (
                <div key={key} className="conversation-popout">
                  {renderNewChat(tgt)}
                </div>
              );
            else
              return (
                <div
                  className={`chat-min ${convo === tgt ? "blink" : ""}`}
                  key={key}
                  style={{
                    cursor: "pointer",
                    backgroundColor: convo === tgt ? "#C53030" : "#1A202C",
                  }}
                  onClick={() => setTarget(tgt)}
                >
                  {tgt}
                </div>
              );
          })}
        </div>
      )}
    </div>
  );
};

export default HelpChat;
