use anchor_lang::{
    prelude::*,
};

declare_id!("5hH748CgCFrbuJ19GtdgaB9M1pV5VuUuTicTyz8Jhr3d");


#[program]
pub mod bubbles {
    use super::*;

    pub fn create_game(ctx: Context<CreateGame>, players: Vec<Pubkey>, items_by_line: u8, lines: u8, target: u8) -> Result<()> {
        let mut board: Vec<Bubble> = [].to_vec();
        for i in 0..(items_by_line * lines){
            board.push(Bubble { player: i % players.len() as u8, amount: 1 })
        }
        
        let game = &mut ctx.accounts.game;

        game.target = target;
        game.mode = "v0".to_string();
        game.board = board;
        game.players = players;
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
