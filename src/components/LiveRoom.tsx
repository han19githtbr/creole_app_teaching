"use client";

import "@livekit/components-styles";
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
} from "@livekit/components-react";

export function LiveRoom({
  token,
  serverUrl,
  canPublish,
}: {
  token: string;
  serverUrl: string;
  canPublish: boolean;
}) {
  return (
    <div className="h-[70vh] overflow-hidden rounded-xl border border-[#e7e5e4] bg-black">
      <LiveKitRoom
        token={token}
        serverUrl={serverUrl}
        connect
        video={canPublish}
        audio={canPublish}
        data-lk-theme="default"
        style={{ height: "100%" }}
      >
        <VideoConference chatMessageFormatter={undefined} />
        <RoomAudioRenderer />
      </LiveKitRoom>
    </div>
  );
}
