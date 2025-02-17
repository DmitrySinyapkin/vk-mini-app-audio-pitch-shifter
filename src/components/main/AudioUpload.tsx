import { DragEventHandler, FC, useContext, useEffect, useRef, useState } from "react";
import { PlayerContext } from "../../context/PlayerContext";
import { Placeholder, DropZone, VisuallyHidden, Spinner } from "@vkontakte/vkui";
import { Icon56MusicOutline } from '@vkontakte/icons';
import CustomSnackbar from "../common/CustomSnackbar";
import { isFileFormatSupported } from "../../utils/fileUtils";

const AudioUpload = () => {
    const { player, setTrack } = useContext(PlayerContext)

    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (player?.loaded) {
            setLoading(false)
        }
    }, [player?.loaded])

    const Item: FC<{ active: boolean }> = ({ active }) => (
        <Placeholder.Container>
          <Placeholder.Icon>
            {
                loading 
                    ? <Spinner size="large" />
                    : <Icon56MusicOutline fill={active ? 'var(--vkui--color_icon_accent)' : undefined} />
            }
          </Placeholder.Icon>
          <Placeholder.Header>Загрузить аудио</Placeholder.Header>
          <Placeholder.Text>
            Перетащите mp3 или wav файл сюда, чтобы изменить его тональность или темп
          </Placeholder.Text>
          <VisuallyHidden>
            <input type="file" ref={inputRef} onChange={onInputFileChange} />
          </VisuallyHidden>
        </Placeholder.Container>
      );
      
    const dragOverHandler: DragEventHandler<HTMLDivElement> = (event) => {
        event.preventDefault()
    };
      
    const dropHandler: DragEventHandler<HTMLDivElement> = (event) => {
        event.preventDefault()
        if (event.dataTransfer) {
            uploadFile(event.dataTransfer.files[0])
        } 
    }

    const uploadFile = (file: File) => {
        if (isFileFormatSupported(file)) {
            setLoading(true)
            const title = file.name || ''
            
            const fileReader = new FileReader()
            fileReader.onload = function(e) {
                const url = e.target?.result
                if (url && typeof url === 'string' && setTrack) {
                    setTrack(url, title)
                }
            }
            fileReader.readAsDataURL(file)
        } else {
            setError('Неподдерживаемый формат. Загрузите mp3 или wav файл')
        }
    }

    const onInputFileChange = () => {
        if (inputRef.current?.files && inputRef.current.files[0]) {
            uploadFile(inputRef.current.files[0])
        }
    }

    const onDropZoneClick = () => {
        inputRef.current?.click()
    }

    const onErrorClose = () => {
        setError(null)
    }

    return (
        <>
            <DropZone.Grid>
                <DropZone onDragOver={dragOverHandler} onDrop={dropHandler} onClick={onDropZoneClick} style={{ cursor: 'pointer' }}>
                    {({ active }) => <Item active={active} />}
                </DropZone>
            </DropZone.Grid>
            {error && <CustomSnackbar type="error" text={error} onClose={onErrorClose} />}
        </>
    )
}

export default AudioUpload
