use std::usize;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str, primes: usize) -> String {
    let first_n_primes = find_primes(primes);
    let joiner = if first_n_primes.len() == 2 {
        " & "
    } else {
        ", "
    };
    let first_n_primes_str = first_n_primes
        .into_iter()
        .map(|x| x.to_string())
        .collect::<Vec<_>>()
        .join(joiner);
    format!(
        "Hello, {}! You've been greeted from Rust! The first {} primes are: {}.",
        name, primes, first_n_primes_str
    )
}

fn find_primes(n: usize) -> Vec<usize> {
    let mut primes = Vec::new();

    for value in 0..usize::MAX {
        let mut add_value = false;
        if value == 2 {
            primes.push(value);
        }
        for prev in primes.iter() {
            add_value = false;
            if value % prev == 0 {
                break;
            }
            add_value = true;
        }
        if add_value {
            primes.push(value)
        }
        if primes.len() == n {
            break;
        }
    }
    primes
}

#[tauri::command]
async fn convergent_inverse_squares(max_n: usize) -> f64 {
    tauri::async_runtime::spawn_blocking(move || {
        let mut sum = 0.0;

        for n in 1..=max_n {
            sum += 1.0 / (n as f64).powi(2)
        }

        sum
    })
    .await
    .unwrap()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, convergent_inverse_squares])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
