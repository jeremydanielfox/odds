//
//  NewOddsViewController.swift
//  Odds
//
//  Created by Eric Saba on 10/13/16.
//  Copyright © 2016 Eric Saba. All rights reserved.
//

import UIKit

class NewOddsViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {
    @IBOutlet weak var descriptionTV: UITextView!
    @IBOutlet weak var maxOddsTF: UITextField!
    @IBOutlet weak var tableView: UITableView!

    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return 1
    }
    
    func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "ChallengeFriendCell", for: indexPath)
        
        cell.textLabel?.text = "Friends' names"
        
        return cell
    }

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
