import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import { useState, useEffect, useRef, Suspense } from 'react';
import styled, { css } from 'styled-components';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

// Components
import EnvSky from '../ui/CollectionSpace/EnvSky';
import EnvStars from '../ui/CollectionSpace/EnvStars';
import Floor from '../ui/CollectionSpaceThree/Floor';
import Light from '../ui/CollectionSpaceThree/Light';
import Wall from '../ui/CollectionSpaceThree/Wall';
import Player from '../ui/CollectionSpace/Player';
import Spot from '../ui/World/3Dcanvas/Spot';
import Door from '../ui/CollectionSpace/Door';
import Video from '../ui/CollectionSpaceThree/Video';
import Tv from '../ui/CollectionSpaceTwo/Tv';
import ImageFrame from '../ui/CollectionSpaceThree/ImageFrame';
import CollectImage from '../ui/CollectionSpaceThree/CollectImage';
import VisitText from '../ui/CollectionSpaceThree/VisitText';
import VisitCard from '../ui/CollectionSpaceThree/VisitCard';
import Bed from '../ui/CollectionSpaceThree/Bed';
import Table from '../ui/CollectionSpaceThree/Table';
import Camera from '../ui/CollectionSpaceThree/Camera';
import TvTable from '../ui/CollectionSpaceThree/TvTable';
import Remote from '../ui/CollectionSpaceThree/Remote';
import Rabbit from '../ui/CollectionSpaceThree/Rabbit';
import Pencil from '../ui/CollectionSpaceThree/Pencil';
import Window from '../ui/CollectionSpaceThree/Window';
import Closet from '../ui/CollectionSpaceThree/Closet';
import Piano from '../ui/CollectionSpaceThree/Piano';
import CafeTable from '../ui/CollectionSpaceThree/CafeTable';
import WriteVisitMemoModal from '../ui/public/WriteVisitMemoModal';
import Flower from '../ui/CollectionSpaceThree/Flower';
import PhotoBook from '../ui/CollectionSpaceThree/PhotoBook';
import ImageEffect from './ImageEffect';
import PhotoBoxHeader from '../ui/public/PhotoBoxHeader';
import ExitFooter from '../ui/public/ExitFooter';
import AudioPlayer from '../ui/public/AudioPlayer';
import UploadImagePostModal from '../ui/public/UploadImagePostModal';
import UploadVideoModal from '../ui/public/UploadVideoModal';
import ViewImagePostModal from '../ui/public/ViewImagePostModal';
import userAPI from '../../apis/userAPI';
import RoomHonorAlert from '../layout/World/RoomHonorAlert';

const CollectionSpaceThree = () => {
  const aspect = window.innerWidth / window.innerHeight;
  const doorSpot = { x: 2.1, y: 0.1, z: -6 };
  const roomName = useParams().id;
  const navigate = useNavigate();

  const [isCollectionVisible, setIsColletionVisible] = useState(false);

  const [myPlayer, setMyPlayer] = useState({});
  const [isLocked, setIsLocked] = useState(false);
  const [album, setAlbum] = useState(false);
  const [camera, setCamera] = useState(false);
  const [pencil, setPencil] = useState(false);
  const [visitMemo, setVisitMemo] = useState(false);
  const [videoRemote, setVideoRemote] = useState(false);

  const [albumModalOpen, setAlbumModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [uploadImageModalOpen, setUploadImageModalOpen] = useState(false);
  const [pencilModalOpen, setPencilModalOpen] = useState(false);
  const [showImageEffect, setShowImageEffect] = useState(false);
  const [tvVideo, setTvVideo] = useState();

  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isBedReady, setIsBedReady] = useState(false);
  const [isFrameReady, setIsFrameReady] = useState(false);
  const [isCafetableReady, setIsCafetableReady] = useState(false);
  const [isPianoReady, setIsPianoReady] = useState(false);
  const [isPencilReady, setIsPencilReady] = useState(false);
  const [isPhotoBookReady, setIsPhotoBookReady] = useState(false);
  const [isRemoteReady, setIsRemoteReady] = useState(false);
  const [isTableReady, setIsTableReady] = useState(false);
  const [isTvReady, setIsTvReady] = useState(false);
  const [isTvTableReady, setIsTvTableReady] = useState(false);
  const [isMeshReady, setIsMeshReady] = useState(false);
  const [isDoorReady, setIsDoorReady] = useState(false);
  const [isClosetReady, setIsClosetReady] = useState(false);
  const [isFlowerReady, setIsFlowerReady] = useState(false);
  const [isWindowReady, setIsWindowReady] = useState(false);
  const [isRabbitReady, setIsRabbitReady] = useState(false);

  const [images, setImages] = useState();
  const [guestBooks, setGuestBooks] = useState();
  const [albumDetail, setAlbumDetail] = useState();
  console.log(albumDetail);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const nickname = queryParams.get('nickname');

  const handleComponentLoad = (componentName) => {
    switch (componentName) {
      case 'Camera':
        setIsCameraReady(true);
      case 'Bed':
        setIsBedReady(true);
      case 'Cafetable':
        setIsCafetableReady(true);
      case 'ImageFrame':
        setIsFrameReady(true);
      case 'Closet':
        setIsClosetReady(true);
      case 'Flower':
        setIsFlowerReady(true);
      case 'Piano':
        setIsPianoReady(true);
      case 'Rabbit':
        setIsRabbitReady(true);
      case 'Pencil':
        setIsPencilReady(true);
      case 'PhotoBook':
        setIsPhotoBookReady(true);
      case 'Remote':
        setIsRemoteReady(true);
      case 'Table':
        setIsTableReady(true);
      case 'Tv':
        setIsTvReady(true);
      case 'TvTable':
        setIsTvTableReady(true);
      case 'Mesh':
        setIsMeshReady(true);
      case 'Door':
        setIsDoorReady(true);
      case 'Window':
        setIsWindowReady(true);
      default:
        break;
    }
  };

  const params = useParams().id;

  const userId = JSON.parse(sessionStorage.getItem('isLogin'))['IdState'];

  const handleSubmit = async (e) => {
    // e.preventDefault();

    try {
      const response = await userAPI.get(`/user/${params}/content`);

      console.log('서버 응답:', response.data);
      setImages(response.data.imageBoards);
      setGuestBooks(response.data.guestbooks);
      response.data.mp4Boards[0] &&
        setTvVideo(response.data.mp4Boards[0].fileUrl);

      // 성공적으로 게시물을 생성한 후에 추가적인 처리를 할 수 있습니다.
    } catch (error) {
      console.error('서버 오류:', error);
    }
  };
  // console.log(friend);

  useEffect(() => {
    handleSubmit();
  }, []);

  const playTransitionSound = () => {
    const audio = new Audio('/musics/doorsound.mp3');
    audio.play();
  };

  const fadeIn = {
    hidden: { opacity: 0 }, // 초기 상태
    visible: { opacity: 1 }, // 최종 상태
  };

  const [boardDetail, setBoardDetail] = useState();

  const getImageDetail = async (e) => {
    // e.preventDefault();

    try {
      const response = await userAPI.get(`/board/${albumDetail}`);

      console.log('서버 응답:', response.data);
      setBoardDetail(response.data);
      setAlbumModalOpen(true);

      // 성공적으로 게시물을 생성한 후에 추가적인 처리를 할 수 있습니다.
    } catch (error) {
      console.error('서버 오류:', error);
    }
  };

  useEffect(() => {
    if (album === true) {
      getImageDetail();
    } else {
      setAlbumModalOpen(false);
    }
  }, [album]);

  useEffect(() => {
    if (camera === true) {
      setUploadImageModalOpen(true);
    } else {
      setUploadImageModalOpen(false);
    }
  }, [camera]);

  useEffect(() => {
    if (videoRemote === true) {
      setVideoModalOpen(true);
    } else {
      setVideoModalOpen(false);
    }
  }, [videoRemote]);

  useEffect(() => {
    if (pencil === true) {
      setPencilModalOpen(true);
    } else {
      setPencilModalOpen(false);
    }
  }, [pencil]);

  useEffect(() => {
    if (
      Math.abs(doorSpot.x - myPlayer.x) < 1.5 &&
      Math.abs(doorSpot.z - myPlayer.z) < 1.5
    ) {
      setIsColletionVisible(true);
      navigate('/world');
      playTransitionSound();
    } else {
      setIsColletionVisible(false);
    }
  }, [doorSpot]);
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={{ duration: 3, delay: 1 }} // 이동 시간 설정
      variants={fadeIn} // 애니메이션 variant
    >
      <div
        style={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
          background: '#000',
        }}
      >
        <Suspense fallback={null}>
          {showImageEffect ? (
            <ImageEffect images={images} />
          ) : (
            <Canvas
              gl={{ antialias: true }}
              shadows={{
                enabled: true,
                autoUpdate: true,
                type: THREE.PCFSoftShadowMap,
              }}
              camera={{
                fov: 45,
                aspect: aspect,
                near: 0.1,
                far: 100,
                position: [2, 2, -4],
                zoom: 0.5,
              }}
              // orthographic
              // camera={{
              //   zoom: 50,
              //   position: [1, 10, 5],
              //   left: -1 * aspect,
              //   right: 1 * aspect,
              //   top: 1,
              //   bottom: -1,
              //   near: 0.1,
              //   far: 1000,
              // }}
            >
              <EnvSky />
              <EnvStars />
              <Light />
              <Floor />
              <Rabbit onLoad={() => handleComponentLoad('Rabbit')} />
              <Tv onLoad={() => handleComponentLoad('Tv')} />
              <Remote
                userId={userId}
                params={params}
                onLoad={() => handleComponentLoad('Remote')}
              />
              <TvTable onLoad={() => handleComponentLoad('TvTable')} />
              <CollectImage images={images} />
              {isFrameReady ? (
                <ImageFrame
                  key="frame-ready"
                  onLoad={() => handleComponentLoad('ImageFrame')}
                />
              ) : null}
              <VisitText guestBooks={guestBooks} />
              {/* <VisitCard onLoad={() => handleComponentLoad("Mesh")} /> */}
              <Camera
                userId={userId}
                params={params}
                onLoad={() => handleComponentLoad('Camera')}
              />
              <Pencil
                userId={userId}
                params={params}
                onLoad={() => handleComponentLoad('Pencil')}
              />
              <Table onLoad={() => handleComponentLoad('Table')} />
              <Bed onLoad={() => handleComponentLoad('Bed')} />
              <Door />
              <Video tvVideo={tvVideo} />
              <Wall />
              <Window onLoad={() => handleComponentLoad('Window')} />
              <Closet onLoad={() => handleComponentLoad('Closet')} />
              <Piano
                userId={userId}
                params={params}
                onLoad={() => handleComponentLoad('Piano')}
              />
              <CafeTable onLoad={() => handleComponentLoad('Cafetable')} />
              <Flower onLoad={() => handleComponentLoad('Flower')} />
              <PhotoBook onLoad={() => handleComponentLoad('PhotoBook')} />
              <Spot spot={doorSpot} />
              <Player
                roomName={roomName}
                setMyPlayer={setMyPlayer}
                setIsLocked={setIsLocked}
                isLocked={isLocked}
                setAlbum={setAlbum}
                setCamera={setCamera}
                setPencil={setPencil}
                setVisitMemo={setVisitMemo}
                setVideoRemote={setVideoRemote}
                setShowImageEffect={setShowImageEffect}
                setAlbumDetail={setAlbumDetail}
              />
            </Canvas>
          )}
        </Suspense>
        <AudioPlayer src="/musics/room3.mp3" />

        {showImageEffect ? <PhotoBoxHeader /> : ''}
        {showImageEffect ? <ExitFooter /> : ''}
        <ContainerImage uploadImageModalOpen={uploadImageModalOpen}>
          {uploadImageModalOpen && (
            <UploadImagePostModal
              setCamera={setCamera}
              setUploadImageModalOpen={setUploadImageModalOpen}
              setImages={setImages}
            />
          )}
        </ContainerImage>
        <ContainerRemote videoModalOpen={videoModalOpen}>
          {videoModalOpen && (
            <UploadVideoModal
              setVideoRemote={setVideoRemote}
              setVideoModalOpen={setVideoModalOpen}
              setTvVideo={setTvVideo}
            />
          )}
        </ContainerRemote>

        <ContainerVideo albumModalOpen={albumModalOpen}>
          {albumModalOpen && (
            <ViewImagePostModal
              setAlbumModalOpen={setAlbumModalOpen}
              setAlbum={setAlbum}
              boardDetail={boardDetail}
            />
          )}
        </ContainerVideo>
        <Container pencilModalOpen={pencilModalOpen}>
          {pencilModalOpen && (
            <WriteVisitMemoModal
              setPencilModalOpen={setPencilModalOpen}
              setPencil={setPencil}
              setGuestBooks={setGuestBooks}
            />
          )}
        </Container>
        {nickname && <RoomHonorAlert roomHonor={nickname} />}

        <CrossHair isLocked={isLocked} />
      </div>
    </motion.div>
  );
};

const Container = styled.div`
  ${({ pencilModalOpen }) => {
    return css`
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: ${pencilModalOpen ? 1 : -1};
      background: ${pencilModalOpen ? 'rgba(0, 0, 0, 0.4)' : 'transparent'};
    `;
  }}
`;

const ContainerImage = styled.div`
  ${({ uploadImageModalOpen }) => {
    return css`
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: ${uploadImageModalOpen ? 1 : -1};
      background: ${uploadImageModalOpen
        ? 'rgba(0, 0, 0, 0.4)'
        : 'transparent'};
    `;
  }}
`;

const ContainerVideo = styled.div`
  ${({ albumModalOpen }) => {
    return css`
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: ${albumModalOpen ? 1 : -1};
      background: ${albumModalOpen ? 'rgba(0, 0, 0, 0.4)' : 'transparent'};
    `;
  }}
`;

const ContainerRemote = styled.div`
  ${({ videoModalOpen }) => {
    return css`
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: ${videoModalOpen ? 1 : -1};
      background: ${videoModalOpen ? 'rgba(0, 0, 0, 0.4)' : 'transparent'};
    `;
  }}
`;

const CrossHair = styled.div`
  ${({ isLocked }) => {
    return css`
      position: fixed;
      top: 50%;
      left: 50%;
      width: 2px;
      height: 2px;
      background: #f00;
      border: 10px solid #fff;
      border-radius: 50%;
      pointer-events: none;
      z-index: 10000;
      visibility: ${isLocked
        ? 'visible'
        : 'hidden'}; // initial visibility is hidden
    `;
  }}
`;

export default CollectionSpaceThree;
