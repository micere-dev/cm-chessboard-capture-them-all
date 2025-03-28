/**
 * Author and copyright: Stefan Haack (https://shaack.com)
 * Repository: https://github.com/shaack/cm-chessboard-capture-them-all
 * License: MIT, see file 'LICENSE'
 */
import {Extension} from "cm-chessboard/src/model/Extension.js"
import {COLOR, POINTER_EVENTS} from "cm-chessboard/src/Chessboard.js"
import {Markers} from "cm-chessboard/src/extensions/markers/Markers.js"

export class CtaLevel extends Extension {

    /** @constructor */
    constructor(chessboard) {
        super(chessboard)
        chessboard.addExtension(Markers)
        chessboard.enableSquareSelect(POINTER_EVENTS.pointerdown, (event) => {
            if (event.square) {
                const piece = this.chessboard.getPiece(event.square)
                const blackPieceSquare = this.chessboard.getPosition().getPieces(COLOR.black)[0].square
                if (piece && piece.charAt(0) === "w" && this.isValidMove(blackPieceSquare, event.square)) {
                    this.chessboard.movePiece(blackPieceSquare, event.square, true)
                    this.chessboard.context.style.cursor = ""
                }
            }
        })
/*
        chessboard.enableSquareSelect(POINTER_EVENTS.pointermove, (event) => {
            const piece = this.chessboard.getPiece(event.square)
            const blackPieceSquare = this.chessboard.getPosition().getPieces(COLOR.black)[0].square
            if (piece && piece.charAt(0) === "w" && this.isValidMove(blackPieceSquare, event.square)) {
                this.chessboard.context.style.cursor = "pointer"
            } else {
                this.chessboard.context.style.cursor = ""
            }
        })
*/
        chessboard.startPuzzle = this.startPuzzle.bind(this)
    }

    isValidMove(squareFrom, squareTo) {
        const piece = this.chessboard.getPiece(squareFrom)
        switch (piece.charAt(1)) {
            case "r":
                return this.validateRookMove(squareFrom, squareTo)
            case "b":
                return this.validateBishopMove(squareFrom, squareTo)
            case "q":
                return this.validateQueenMove(squareFrom, squareTo)
            case "n":
                return this.validateKnightMove(squareFrom, squareTo)
        }
    }

    startPuzzle(position) {
        this.chessboard.setPosition(position)
    }

    validateRookMove(squareFrom, squareTo) {
        const fileFrom = squareFrom.charCodeAt(0) - 97
        const rankFrom = parseInt(squareFrom.charAt(1)) - 1
        const fileTo = squareTo.charCodeAt(0) - 97
        const rankTo = parseInt(squareTo.charAt(1)) - 1
        // prevent jumping over pieces
        if (fileFrom === fileTo) {
            for (let rank = Math.min(rankFrom, rankTo) + 1; rank < Math.max(rankFrom, rankTo); rank++) {
                const square = String.fromCharCode(fileFrom + 97) + (rank + 1)
                if (this.chessboard.getPiece(square)) {
                    return false
                }
            }
        }
        if (rankFrom === rankTo) {
            for (let file = Math.min(fileFrom, fileTo) + 1; file < Math.max(fileFrom, fileTo); file++) {
                const square = String.fromCharCode(file + 97) + (rankFrom + 1)
                if (this.chessboard.getPiece(square)) {
                    return false
                }
            }
        }
        if (fileFrom === fileTo || rankFrom === rankTo) {
            return true
        }
    }

    validateBishopMove(squareFrom, squareTo) {
        const fileFrom = squareFrom.charCodeAt(0) - 97
        const rankFrom = parseInt(squareFrom.charAt(1)) - 1
        const fileTo = squareTo.charCodeAt(0) - 97
        const rankTo = parseInt(squareTo.charAt(1)) - 1
        // prevent jumping over pieces
        for (let file = Math.min(fileFrom, fileTo) + 1; file < Math.max(fileFrom, fileTo); file++) {
            const rank = Math.min(rankFrom, rankTo) + (file - Math.min(fileFrom, fileTo))
            const square = String.fromCharCode(file + 97) + (rank + 1)
            if (this.chessboard.getPiece(square)) {
                return false
            }
        }
        if (Math.abs(fileFrom - fileTo) === Math.abs(rankFrom - rankTo)) {
            return true
        }
    }

    validateQueenMove(squareFrom, squareTo) {
        return this.validateRookMove(squareFrom, squareTo) || this.validateBishopMove(squareFrom, squareTo)
    }

    validateKnightMove(squareFrom, squareTo) {
        // validate knight move
        const fileFrom = squareFrom.charCodeAt(0) - 97
        const rankFrom = parseInt(squareFrom.charAt(1)) - 1
        const fileTo = squareTo.charCodeAt(0) - 97
        const rankTo = parseInt(squareTo.charAt(1)) - 1
        if (Math.abs(fileFrom - fileTo) === 1 && Math.abs(rankFrom - rankTo) === 2) {
            return true
        }
        if (Math.abs(fileFrom - fileTo) === 2 && Math.abs(rankFrom - rankTo) === 1) {
            return true
        }
    }

}
