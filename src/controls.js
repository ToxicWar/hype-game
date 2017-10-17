import config from './config/config.js';
import fly from 'voxel-fly';
import highlight from 'voxel-highlight';
import socket from './socket.js';
import { alert } from 'notie';
import _ from 'lodash';
import voxelStore from './config/voxelStore.js'


const controls = (game, user) => {
  let blockPosPlace;
  const hl = game.highlighter = highlight(game, {
      color: 0xff0000,
      distance: 4,
      adjacentActive: () => true,
  })

  hl.on('remove-adjacent', () => blockPosPlace = null);
  hl.on('highlight-adjacent', (voxel) => blockPosPlace = voxel);
  
  game.chunkRegion.on('change', (pos) => {
    const userPositon = user.getPosition();
    const range = config.ws.range;

    socket.sendWs('range', { x: userPositon.x, y: userPositon.z, range });

    game.voxels.requestMissingChunks(game.playerPosition())
  });

  game.on('renderChunk', (chunk) => {
    const pos = game.chunkToWorld(chunk.position);
    // const store = voxelStore[`${pos[0]}|${pos[2]}`]
  });

  game.removeFarChunks = () => true;

  game.on('fire', (target, state) => {
    const position = blockPosPlace;

    if (position && _.every(position, (v, k) => v < config.worldSize[k] && v > 0) && game.canCreateBlock(position)) {
      const [x, z, y] = position;

      socket.sendWs('update', { x, y, z, owner: user.color });
    } else {
      if (position) alert({ type: 'warning', text: 'Voxel cannot be created at this position', position: 'bottom' });
    }
  });
}


export default controls;