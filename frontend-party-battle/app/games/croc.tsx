import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef } from "react";
import { CrocGameProvider, useCrocGameContext } from "@/games/CrocGameProvider";
import Loading from "@/components/Loading";
import CrocGameContent from "@/games/CrocGameContent";

export default function CrocScreen() {
  return (
    <CrocGameProvider>
      <CrocGameView />
    </CrocGameProvider>
  );
}

function CrocGameView() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { room, isLoading, joinCrocGame, leaveCrocGame } = useCrocGameContext();
  const hasJoinedRef = useRef(false);

  useEffect(() => {
    if (roomId && !room && !hasJoinedRef.current) {
      console.log("joining croc game");
      hasJoinedRef.current = true;
      joinCrocGame(roomId);
    }
  }, [roomId, room]);

  if (isLoading || !room) {
    return <Loading />;
  }

  return <CrocGameContent room={room} />;
}
