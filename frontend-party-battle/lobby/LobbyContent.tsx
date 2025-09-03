import useColyseusState from '@/colyseus/useColyseusState';
import SafeAreaPlaceholder from '@/components/SafeAreaPlaceholder';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { LogOutIcon, QrCodeIcon, ShareIcon } from '@/components/ui/icon';
import { QrCodeModal } from '@/components/ui/modal/qr-code-modal';
import { Text } from '@/components/ui/text';
import { useLobbyContext } from '@/lobby/LobbyProvider';
import PlayerList from '@/lobby/PlayerList';
import createWebURL from '@/routing/createWebUrl';
import { Room } from 'colyseus.js';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Share, View } from 'react-native';
import {
  GameType,
  KeyValuePairNumberInterface,
  Lobby,
} from 'types-party-battle';

export interface PlayerData {
  name: string;
  ready: boolean;
}

export interface GameHistoryData {
  gameType: GameType;
  scores: KeyValuePairNumberInterface[];
}

interface LobbyContentProps {
  room: Room<Lobby>;
}

export default function LobbyContent({ room }: LobbyContentProps) {
  const players = useColyseusState(room, (state) =>
    Array.from(state.players?.entries() || []).map(
      ([id, player]) =>
        [id, { name: player.name, ready: player.ready }] as [string, PlayerData]
    )
  );
  const gameHistory = useColyseusState(room, (state) =>
    Array.from(state.gameHistory?.entries() || []).map(
      ([id, game]) =>
        [id, { gameType: game.gameType, scores: game.scores }] as [
          string | number,
          GameHistoryData,
        ]
    )
  );
  const currentGame = useColyseusState(room, (state) => state.currentGame);
  const currentGameRoomId = useColyseusState(
    room,
    (state) => state.currentGameRoomId
  );

  const [isReady, setIsReady] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const router = useRouter();
  const { leaveLobby } = useLobbyContext();

  const partyCode = room.roomId;
  const shareUrl = createWebURL(`/?partyCode=${partyCode}`);

  useEffect(() => {
    if (currentGame && currentGameRoomId) {
      switch (currentGame) {
        case 'croc':
          console.log('redirecting to croc game');
          router.push(`/games/croc?roomId=${currentGameRoomId}`);
          break;
        case 'snake':
          throw new Error('Snake game redirection not implemented yet');
        default:
          throw new Error(`Unknown game type: ${currentGameRoomId}`);
      }
    }
  }, [currentGame, currentGameRoomId, router]);

  const onToggleReady = () => {
    room.send('ready', !isReady);
    setIsReady((prev) => !prev);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        url: shareUrl,
      });
    } catch {}
  };

  const handleLeaveParty = () => {
    leaveLobby();
    router.push('/');
  };

  return (
    <View className="flex-1 bg-background-0 dark:bg-background-950">
      <SafeAreaPlaceholder position="top" />
      <View className="flex-1 p-4 justify-center items-center">
        <View className="flex-1 max-w-md w-full justify-evenly items-center">
          <View className="flex-row items-center justify-between gap-2 w-full">
            <View className="flex-col items-center">
              <Text className="text-sm text-typography-600 dark:text-typography-400">
                Party Code
              </Text>
              <Text className="text-md font-semibold">{partyCode}</Text>
            </View>
            <View className="flex-row items-center justify-end gap-2">
              <Button
                size="md"
                variant="outline"
                className="p-2.5"
                onPress={handleShare}
              >
                <ButtonIcon as={ShareIcon} />
              </Button>
              <Button
                size="md"
                variant="outline"
                className="p-2.5"
                onPress={() => setIsQrModalOpen(true)}
              >
                <ButtonIcon as={QrCodeIcon} />
              </Button>
              <Button
                size="md"
                action="negative"
                className="p-2.5"
                onPress={handleLeaveParty}
              >
                <ButtonIcon as={LogOutIcon} />
              </Button>
            </View>
          </View>

          <View className="flex-row w-full">
            <PlayerList
              players={players}
              gameHistory={gameHistory}
              currentPlayerId={room.sessionId}
            />
          </View>

          <View className="flex-row w-full justify-center">
            <Button size="xl" action={'primary'} onPress={onToggleReady}>
              <ButtonText>{isReady ? 'CANCEL' : 'PLAY'}</ButtonText>
            </Button>
          </View>
        </View>
      </View>
      <SafeAreaPlaceholder position="bottom" />

      <QrCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        roomId={partyCode}
        roomUrl={shareUrl}
      />
    </View>
  );
}
