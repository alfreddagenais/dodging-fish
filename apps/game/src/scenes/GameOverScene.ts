import Phaser from 'phaser'
import i18next from 'i18next'
import RoundRectangleCanvas from 'phaser3-rex-plugins/plugins/roundrectanglecanvas'
import LocalStorageData from 'phaser3-rex-plugins/plugins/localstorage-data'
import getCurrentColor from '@/helpers/getCurrentColor'
import constants from '@/constants'

type GameOverData = {
  score: number
  roe: number
}

export default class GameOverScene extends Phaser.Scene {
  private score = 0
  private roe = 0

  constructor() {
    super(constants.SCENES.GAME_OVER)
  }

  init(data: GameOverData) {
    this.score = data.score
    this.roe = data.roe
  }

  create() {
    this.addBackgroundScore()
    this.addScore()
    this.startMainMenuEvent()
    this.addBestScoreValue()
    this.incGamesPlayedValue()
    this.incRoeValue()

    this.scene.resume(constants.SCENES.GAME_INFO_UI, {
      color: getCurrentColor(this.score).spike,
    })
    this.scene.setVisible(true, constants.SCENES.GAME_INFO_UI)
  }

  private addBestScoreValue() {
    const gameInfoUiScene = this.scene.get(constants.SCENES.GAME_INFO_UI)
    const localStorageData = gameInfoUiScene.data.get(
      'localStorageData'
    ) as LocalStorageData

    const bestScore = localStorageData.get('bestScore')
    if (this.score > bestScore) {
      localStorageData.set('bestScore', this.score)
    }
  }

  private incGamesPlayedValue() {
    const gameInfoUiScene = this.scene.get(constants.SCENES.GAME_INFO_UI)
    const localStorageData = gameInfoUiScene.data.get(
      'localStorageData'
    ) as LocalStorageData
    localStorageData.inc('gamesPlayed', 1)
  }

  private incRoeValue() {
    const gameInfoUiScene = this.scene.get(constants.SCENES.GAME_INFO_UI)
    const localStorageData = gameInfoUiScene.data.get(
      'localStorageData'
    ) as LocalStorageData
    localStorageData.inc('roe', this.roe)
  }

  private addBackgroundScore() {
    const { centerX, centerY } = this.cameras.main

    const rect = new RoundRectangleCanvas(
      this,
      centerX,
      centerY,
      700,
      700,
      {
        radius: 160,
      },
      constants.COLORS.ACCENT
    )
    this.add.existing(rect)
  }

  private addScore() {
    const { centerX, centerY } = this.cameras.main

    this.add
      .text(centerX, centerY - 125, i18next.t('Score'), {
        fontSize: '52px',
        fontFamily: constants.FONT.FAMILY,
        align: 'center',
      })
      .setOrigin(0.5, 0.5)

    this.add
      .text(centerX, centerY + 50, String(this.score || 0), {
        fontSize: '300px',
        fontFamily: constants.FONT.FAMILY,
        align: 'center',
      })
      .setOrigin(0.5, 0.5)
  }

  private startMainMenuEvent() {
    this.input.on(
      'pointerdown',
      () => {
        this.scene.stop(constants.SCENES.GAME_FIELD)
        this.scene.stop(constants.SCENES.GAME_INFO_UI)
        this.scene.stop()

        this.scene.start(constants.SCENES.MAIN_MENU)
      },
      this
    )
  }
}
