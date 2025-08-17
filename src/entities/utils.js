export const validateInteractions = (dialogManager, player) => {
  const mentorTalk = dialogManager?.currentNPC?.isMentor

  const npcOptioning = !!dialogManager.currentOptions
  const menuOpen = player.menuGame.isOpen

  const isShooting = player.sprite.current === player.sprite.state.shot

  return mentorTalk || npcOptioning || menuOpen || isShooting
}
