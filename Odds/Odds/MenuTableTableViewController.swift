//
//  MenuTableTableViewController.swift
//  Odds
//
//  Created by Eric Saba on 10/13/16.
//  Copyright © 2016 Eric Saba. All rights reserved.
//

import UIKit

class MenuTableTableViewController: UITableViewController {
    private let feedText = "Odds Feed"
    private let requestsText = "Pending Odds"
    private let completedText = "History"
    private let friendsText = "Friends"
    var curUser: User?

    override func viewDidLoad() {
        super.viewDidLoad()
        self.navigationController?.setNavigationBarHidden(false, animated: true)
        self.navigationItem.setHidesBackButton(true, animated: true)
        // Uncomment the following line to preserve selection between presentations
        // self.clearsSelectionOnViewWillAppear = false

        // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
        // self.navigationItem.rightBarButtonItem = self.editButtonItem()
    }
    
    override func viewDidAppear(_ animated: Bool) {
        self.navigationController?.setNavigationBarHidden(false, animated: true)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    // MARK: - Table view data source

    override func numberOfSections(in tableView: UITableView) -> Int {
        // #warning Incomplete implementation, return the number of sections
        return 1
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // #warning Incomplete implementation, return the number of rows
        return 4
    }

    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "MenuCell", for: indexPath)

        if indexPath.row == 0 {
            cell.textLabel?.text = feedText
        }
        else if indexPath.row == 1 {
            cell.textLabel?.text = requestsText
        }
        else if indexPath.row == 2 {
            cell.textLabel?.text = completedText
        }
        else if indexPath.row == 3 {
            cell.textLabel?.text = friendsText
        }

        return cell
    }
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let cell = tableView.cellForRow(at: indexPath)
        if cell?.textLabel?.text == feedText {
            performSegue(withIdentifier: "FeedSegue", sender: self)
        }
        else if cell?.textLabel?.text == requestsText {
            performSegue(withIdentifier: "RequestsSegue", sender: self)
        }
        else if cell?.textLabel?.text == completedText {
            performSegue(withIdentifier: "CompletedSegue", sender: self)
        }
        else if cell?.textLabel?.text == friendsText {
            performSegue(withIdentifier: "FriendsSegue", sender: self)
        }
    }


    /*
    // Override to support conditional editing of the table view.
    override func tableView(_ tableView: UITableView, canEditRowAt indexPath: IndexPath) -> Bool {
        // Return false if you do not want the specified item to be editable.
        return true
    }
    */

    /*
    // Override to support editing the table view.
    override func tableView(_ tableView: UITableView, commit editingStyle: UITableViewCellEditingStyle, forRowAt indexPath: IndexPath) {
        if editingStyle == .delete {
            // Delete the row from the data source
            tableView.deleteRows(at: [indexPath], with: .fade)
        } else if editingStyle == .insert {
            // Create a new instance of the appropriate class, insert it into the array, and add a new row to the table view
        }    
    }
    */

    /*
    // Override to support rearranging the table view.
    override func tableView(_ tableView: UITableView, moveRowAt fromIndexPath: IndexPath, to: IndexPath) {

    }
    */

    /*
    // Override to support conditional rearranging of the table view.
    override func tableView(_ tableView: UITableView, canMoveRowAt indexPath: IndexPath) -> Bool {
        // Return false if you do not want the item to be re-orderable.
        return true
    }
    */


    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
        if let destinationVC = segue.destination as? FriendsViewController {
            destinationVC.curUser = curUser
        }
    }

}
