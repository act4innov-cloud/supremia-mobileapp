import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { PTZCommand } from '@/types/camera.types';
interface Props { onCommand: (cmd: PTZCommand) => void; disabled?: boolean; }
export default function PTZControls({ onCommand, disabled = false }: Props) {
  const mv = (p?: number, t?: number) => onCommand({ action: 'move', pan: p, tilt: t, speed: 5 });
  return (
    <View style={s.w}>
      <Text variant="titleSmall" style={s.t}>Contrôles PTZ</Text>
      <View style={s.row}><View style={s.sp}/><IconButton icon="arrow-up-bold" iconColor="#fff" size={28} style={s.b} onPress={() => mv(0,10)} disabled={disabled}/><View style={s.sp}/></View>
      <View style={s.row}><IconButton icon="arrow-left-bold" iconColor="#fff" size={28} style={s.b} onPress={() => mv(-10,0)} disabled={disabled}/><IconButton icon="home" iconColor="#e94560" size={24} style={s.b} onPress={() => onCommand({action:'home'})} disabled={disabled}/><IconButton icon="arrow-right-bold" iconColor="#fff" size={28} style={s.b} onPress={() => mv(10,0)} disabled={disabled}/></View>
      <View style={s.row}><View style={s.sp}/><IconButton icon="arrow-down-bold" iconColor="#fff" size={28} style={s.b} onPress={() => mv(0,-10)} disabled={disabled}/><View style={s.sp}/></View>
      <View style={s.zr}><IconButton icon="magnify-minus" iconColor="#fff" size={24} style={s.b} onPress={() => onCommand({action:'move',zoom:-10})} disabled={disabled}/><Text style={s.zl}>Zoom</Text><IconButton icon="magnify-plus" iconColor="#fff" size={24} style={s.b} onPress={() => onCommand({action:'move',zoom:10})} disabled={disabled}/></View>
    </View>
  );
}
const s = StyleSheet.create({ w:{alignItems:'center'}, t:{color:'#fff',fontWeight:'bold',marginBottom:12}, row:{flexDirection:'row',alignItems:'center'}, sp:{width:48}, b:{backgroundColor:'#16213e',margin:3}, zr:{flexDirection:'row',alignItems:'center',marginTop:12,gap:8}, zl:{color:'#aaa'} });