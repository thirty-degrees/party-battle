import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
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
  const { room, isLoading, joinCrocGame } = useCrocGameContext();

  useEffect(() => {
    if (roomId) {
      joinCrocGame(roomId);
    }
  }, [roomId, joinCrocGame]);

  if (isLoading || !room) {
    return <Loading />;
  }

  return <CrocGameContent room={room} />;
}
