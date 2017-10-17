import _ from 'lodash';


onmessage = (e) => {
  console.log(e);

  if (e.data.type === 'range') {
    const data = _.filter(e.data.data, (val) => !_.includes(e.data.voxelStore, val));
    e.data.voxelStore.push(data);

    postMessage({type: 'complite', data});
  }
}