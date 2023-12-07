import styled from 'styled-components'
import imgBg from '../assets/discord-bg-1.png'

export const Container = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${imgBg});
  background-position: bottom;
  background-size: contain;
  background-repeat: no-repeat;
  background-color: var(--color-darkblue);
`
