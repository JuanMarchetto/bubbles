use anchor_lang::prelude::*;

declare_id!("5hH748CgCFrbuJ19GtdgaB9M1pV5VuUuTicTyz8Jhr3d");

#[program]
pub mod bubbles {
    use super::*;

    pub fn create_game(
        ctx: Context<CreateGame>,
        players: Vec<Pubkey>,
        items_by_line: u8,
        lines: u8,
        target: u8,
    ) -> Result<()> {
        let mut board: Vec<Bubble> = [].to_vec();
        for i in 0..(items_by_line * lines) {
            board.push(Bubble {
                player: i % players.len() as u8,
                amount: 1,
            })
        }

        let game = &mut ctx.accounts.game;

        game.target = target;
        game.mode = "v0".to_string();
        game.board = board;
        game.players = players;
        game.items_by_line = items_by_line;
        game.updated = Clock::get()?.unix_timestamp;

        Ok(())
    }

    pub fn apply_move(ctx: Context<ApplyMove>, origin: u8, destination: u8) -> Result<()> {
        let game = &mut ctx.accounts.game;
        let items_by_line = game.items_by_line;

        game.board[destination as usize].amount = game.board[destination as usize]
            .amount
            .checked_add(1)
            .unwrap();
        let turn = game.turn.checked_add(1).unwrap();
        for i in 0..(origin / game.items_by_line) {
            game.board[origin as usize - (i * items_by_line) as usize].amount = game.board
                [origin as usize - ((i - 1) * items_by_line) as usize]
                .amount
                .checked_add(1)
                .unwrap();
        }
        game.board[(origin % items_by_line) as usize] = Bubble {
            player: turn
                .checked_add(game.board.len().try_into().unwrap())
                .unwrap() as u8
                % game.players.len() as u8,
            amount: 1,
        };

        game.board = game.board.to_vec();
        game.turn = turn;
        game.updated = Clock::get()?.unix_timestamp;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateGame<'info> {
    #[account(
        init,
        payer = payer,
        space = 1000,
    )]
    pub game: Account<'info, Game>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ApplyMove<'info> {
    #[account(mut)]
    pub game: Account<'info, Game>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Game {
    pub mode: String,
    pub board: Vec<Bubble>,
    pub items_by_line: u8,
    pub players: Vec<Pubkey>,
    pub target: u8,
    pub turn: u64,
    pub updated: i64,
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct Bubble {
    pub player: u8,
    pub amount: u8,
}
