//
//  Votes.swift
//  Odds
//
//  Created by Eric Saba on 11/9/16.
//  Copyright © 2016 Eric Saba. All rights reserved.
//

import UIKit

class Votes: NSObject {
    private var user: User
    private var challenge: Challenge
    private var vote: Int //Bool?
    
    init(user: User, challenge: Challenge, vote: Int) {
        self.user = user
        self.challenge = challenge
        self.vote = vote
    }
    
    func setVote(vote: Int) -> Bool{
        //implement
        
        return false
    }
    
    func removeVote() -> Bool {
        //implement
        
        return false
    }
}
