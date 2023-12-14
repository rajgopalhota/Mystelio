// PersonalMessages.js
import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import { useMessage } from "./../../Context/MessageContext";
import { useAuth } from "../../Context/AuthContext";
import userIcon from "./../../assets/profile.png";
import { serverUrl } from "../../UrlHelper";

const PersonalMessages = () => {
  const { conversationId, toUserId, fromUserId } = useParams();
  const [messageText, setMessageText] = useState();

  const auth = useAuth();
  const { messages, sendMessage, selectConversation } = useMessage();
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    selectConversation(conversationId, fromUserId, toUserId);
  }, [conversationId, fromUserId, toUserId, selectConversation]);

  // Group messages by date
  const messagesByDate = messages.reduce((grouped, message) => {
    const dateKey = new Date(message.createdAt).toLocaleDateString();
    grouped[dateKey] = grouped[dateKey] || [];
    grouped[dateKey].push(message);
    return grouped;
  }, {});

  const messagesEndRef = useRef(null);

  const handleScrollDown = () => {
    window.scrollTo({
      bottom: 0,
      behavior: "smooth",
    });
  };
  useLayoutEffect(() => {
    const observer = new MutationObserver((mutations) => {
      console.log("object");
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          const { current } = messagesEndRef;
          if (current) {
            setTimeout(() => {
              current.scrollIntoView({ behavior: "smooth" });
            }, 0);
          }
        }
      });
    });

    const config = { attributes: false, childList: true, subtree: true };
    observer.observe(messagesContainerRef.current, config);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="personal-messages-container">
      <h2 onClick={handleScrollDown}>Personal Messages</h2>
      <div ref={messagesContainerRef} className="messages">
        <>
          {Object.entries(messagesByDate).map(([date, messages]) => (
            <div className="messages-container" key={date}>
              <span className="messageDate">
                <i class="fa-solid fa-calendar-days"></i>&nbsp;{date}
              </span>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${
                    auth.user.id === message.fromUser.id ? "sent" : "received"
                  }`}
                >
                  {auth.user.id !== message.fromUser.id && (
                    <img
                      src={
                        (message.fromUser.profileImagePath &&
                          `${serverUrl}/${message.fromUser.profileImagePath}`) ||
                        userIcon
                      }
                      alt={`${message.fromUser.id}'s avatar`}
                      className="avatar"
                    />
                  )}
                  <div className="message-content">
                    <p>{message.body}</p>
                    <sub className="message-time">
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </sub>
                  </div>
                  {auth.user.id === message.fromUser.id && (
                    <img
                      src={
                        (auth.user &&
                          auth.user.profileImage &&
                          `${serverUrl}/${auth.user.profileImage}`) ||
                        userIcon
                      }
                      alt={`${auth.user.id}'s avatar`}
                      className="avatar"
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </>
      </div>

      <div className="personal-messages-input">
        <div className="user-comment-box">
          <img
            src={
              (auth.user &&
                auth.user.profileImage &&
                `${serverUrl}/${auth.user.profileImage}`) ||
              userIcon
            }
            className="user-image"
            alt="User"
          />
          <input
            required
            className="commentInput"
            type="text"
            name=""
            placeholder="Add a Message........!!!!"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
          <button
            type="submit"
            className="commentSubmitBtn fa-brands fa-telegram"
            onClick={() =>{
              sendMessage(
                auth.user.id == toUserId ? fromUserId : toUserId,
                messageText
              );
              setMessageText("");
            }
            }
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalMessages;
